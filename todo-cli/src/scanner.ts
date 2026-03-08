import { readFileSync, statSync } from 'node:fs';
import { relative } from 'node:path';
import fg from 'fast-glob';
import ignoreFactory from 'ignore';
import { Config, TodoItem, TodoWithBlame, ScanResult } from './types.js';
import { getBlameForFile } from './git.js';

// Under Node16 CJS/ESM interop the default export may be double-wrapped.
// Resolve to the callable factory at runtime.
const ignore = ignoreFactory.default ?? ignoreFactory;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Comment markers recognized across common languages. */
const COMMENT_MARKERS = [
	'//',   // C-family, JS, TS, Go, Rust, …
	'#',    // Shell, Python, Ruby, YAML, …
	'--',   // SQL, Haskell, Lua, …
	';',    // Lisp, INI, …
	'%',    // LaTeX, Erlang, …
	'/*',   // Block-comment opener (C-family)
	'*',    // Block-comment continuation line
] as const;

const EXPIRATION_RE = /\b(\d{4}-\d{2}-\d{2})\b/;

const BINARY_EXTENSIONS = new Set([
	'.png', '.jpg', '.jpeg', '.gif', '.bmp', '.ico', '.webp', '.svg',
	'.woff', '.woff2', '.ttf', '.eot', '.otf',
	'.zip', '.gz', '.tar', '.bz2', '.7z', '.rar',
	'.pdf', '.doc', '.docx', '.xls', '.xlsx',
	'.mp3', '.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm',
	'.o', '.so', '.dll', '.dylib', '.a', '.wasm',
	'.pyc', '.class', '.jar',
]);

// ---------------------------------------------------------------------------
// Pattern helpers
// ---------------------------------------------------------------------------

/**
 * Build a regex that matches a comment marker followed by a TODO-style tag.
 *
 * Captures:
 *   1 – the tag (e.g. TODO, FIXME)
 *   2 – optional parenthesised assignee / date
 *   3 – the trailing message text
 *
 * The regex is *not* created with the `g` flag, so it is safe to reuse
 * without resetting `lastIndex`.
 */
function buildPattern(tags: string[]): RegExp {
	const escapedTags = tags
		.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
		.join('|');

	const escapedMarkers = COMMENT_MARKERS
		.map(m => m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
		.join('|');

	return new RegExp(
		`(?:^|\\s)(?:${escapedMarkers})\\s*(${escapedTags})` +
		`(?:\\(([^)]+)\\))?:?\\s*(.*)$`,
		'i',
	);
}

/**
 * Build a regex that matches a plain comment-continuation line (same marker,
 * no new tag).  Used to detect multi-line TODO text.
 */
function buildContinuationPattern(tags: string[]): RegExp {
	const escapedTags = tags
		.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
		.join('|');

	const escapedMarkers = COMMENT_MARKERS
		.map(m => m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
		.join('|');

	// Matches a line that starts with whitespace + comment marker + text,
	// but does NOT start a new tag.
	return new RegExp(
		`^(\\s*)(?:${escapedMarkers})\\s+(?!(?:${escapedTags})\\b)(.+)$`,
		'i',
	);
}

// ---------------------------------------------------------------------------
// File helpers
// ---------------------------------------------------------------------------

function isBinaryExtension(file: string): boolean {
	const dot = file.lastIndexOf('.');
	if (dot === -1) return false;
	return BINARY_EXTENSIONS.has(file.slice(dot).toLowerCase());
}

function hasBinaryContent(content: string): boolean {
	return content.slice(0, 8192).includes('\0');
}

function isReadableFile(fullPath: string, maxSize: number): boolean {
	try {
		const stat = statSync(fullPath);
		return stat.size > 0 && stat.size <= maxSize;
	} catch {
		return false;
	}
}

function readTextFile(fullPath: string): string | null {
	try {
		const content = readFileSync(fullPath, 'utf-8');
		return hasBinaryContent(content) ? null : content;
	} catch {
		return null;
	}
}

// ---------------------------------------------------------------------------
// File discovery
// ---------------------------------------------------------------------------

/**
 * Return the list of candidate files to scan, honoring `.gitignore` and the
 * config's ignore globs.
 */
async function discoverFiles(
	cwd: string,
	config: Config,
): Promise<string[]> {
	const ig = ignore();

	try {
		const gitignore = readFileSync(`${cwd}/.gitignore`, 'utf-8');
		ig.add(gitignore);
	} catch {
		// no .gitignore — that's fine
	}
	ig.add(config.ignore);

	const files = await fg('**/*', {
		cwd,
		dot: false,
		onlyFiles: true,
		ignore: config.ignore,
	});

	return files.filter(f => !isBinaryExtension(f) && !ig.ignores(f));
}

// ---------------------------------------------------------------------------
// TODO extraction
// ---------------------------------------------------------------------------

/** Leading-whitespace helper used for multi-line continuation detection. */
function leadingWhitespace(line: string): string {
	const m = /^(\s*)/.exec(line);
	return m ? m[1] : '';
}

/**
 * Extract all TODO items from a single file's content.
 *
 * Supports multi-line continuation: when the line immediately following a
 * TODO comment is at the same indentation, uses the same comment marker, and
 * does *not* start a new tag, its text is appended to the previous item.
 */
function extractTodos(
	content: string,
	filePath: string,
	cwd: string,
	pattern: RegExp,
	continuationPattern: RegExp,
): TodoWithBlame[] {
	const lines = content.split('\n');
	const todos: TodoWithBlame[] = [];
	const relPath = relative(cwd, filePath);

	let currentTodo: TodoWithBlame | null = null;
	let currentIndent: string | null = null;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const match = pattern.exec(line);

		if (match) {
			// Flush any previous in-progress TODO
			if (currentTodo) {
				todos.push(currentTodo);
			}

			const tag = match[1].toUpperCase();
			const parenContent = match[2]?.trim();
			const text = match[3]?.trim() || '';

			const isDate = parenContent ? EXPIRATION_RE.test(parenContent) : false;
			const assignee = parenContent && !isDate ? parenContent : undefined;

			const expMatch =
				EXPIRATION_RE.exec(parenContent ?? '') ||
				EXPIRATION_RE.exec(text);

			currentTodo = {
				file: relPath,
				line: i + 1,
				tag,
				text,
				assignee,
				expiration: expMatch?.[1],
				raw: line.trim(),
			};
			currentIndent = leadingWhitespace(line);
			continue;
		}

		// Check for multi-line continuation
		if (currentTodo && currentIndent !== null) {
			const contMatch = continuationPattern.exec(line);
			if (contMatch && contMatch[1] === currentIndent) {
				const contText = contMatch[2].trim();
				if (contText) {
					currentTodo.text += ' ' + contText;
					currentTodo.raw += '\n' + line.trim();
				}
				continue;
			}

			// Line doesn't continue the TODO — flush it
			todos.push(currentTodo);
			currentTodo = null;
			currentIndent = null;
		}
	}

	// Flush a trailing TODO
	if (currentTodo) {
		todos.push(currentTodo);
	}

	return todos;
}

// ---------------------------------------------------------------------------
// Blame attachment
// ---------------------------------------------------------------------------

function attachBlame(
	cwd: string,
	file: string,
	todos: TodoWithBlame[],
): void {
	if (todos.length === 0) return;

	const blameMap = getBlameForFile(cwd, file);
	for (const item of todos) {
		const blame = blameMap.get(item.line);
		if (blame) {
			item.author = blame.author;
			item.date = blame.date;
			item.ageDays = blame.ageDays;
		}
	}
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface ScanOptions {
	skipBlame?: boolean;
}

export async function scanFiles(
	cwd: string,
	config: Config,
	options?: ScanOptions,
): Promise<ScanResult> {
	const start = Date.now();

	const files = await discoverFiles(cwd, config);
	const pattern = buildPattern(config.tags);
	const continuationPattern = buildContinuationPattern(config.tags);

	const todos: TodoWithBlame[] = [];
	let filesScanned = 0;

	for (const file of files) {
		const fullPath = `${cwd}/${file}`;

		if (!isReadableFile(fullPath, config.maxFileSize)) continue;

		const content = readTextFile(fullPath);
		if (content === null) continue;

		filesScanned++;

		const fileTodos = extractTodos(
			content,
			fullPath,
			cwd,
			pattern,
			continuationPattern,
		);

		if (!options?.skipBlame) {
			attachBlame(cwd, file, fileTodos);
		}

		todos.push(...fileTodos);
	}

	return {
		todos,
		filesScanned,
		duration: Date.now() - start,
	};
}

export function filterByDiff(
	todos: TodoWithBlame[],
	changedFiles: Set<string>,
): TodoWithBlame[] {
	return todos.filter(t => changedFiles.has(t.file));
}
