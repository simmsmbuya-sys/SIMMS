import { readFileSync, statSync } from 'node:fs';
import { relative } from 'node:path';
import fg from 'fast-glob';
import ignoreFactory from 'ignore';
const ignore = ignoreFactory.default ?? ignoreFactory;
import { Config, TodoItem, TodoWithBlame, ScanResult } from './types.js';
import { getBlameForLine } from './git.js';

function buildPattern(tags: string[]): RegExp {
	const tagGroup = tags.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
	// Match comment markers followed by TODO tags
	// Captures: tag, optional assignee in parens, optional colon, the message
	return new RegExp(
		`(?:^|\\s)(?:\\/\\/|#|--|;|%|\\/\\*|\\*)\\s*(${tagGroup})` +
		`(?:\\(([^)]+)\\))?:?\\s*(.*)$`,
		'i'
	);
}

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

function isBinaryExtension(file: string): boolean {
	const dot = file.lastIndexOf('.');
	if (dot === -1) return false;
	return BINARY_EXTENSIONS.has(file.slice(dot).toLowerCase());
}

export async function scanFiles(cwd: string, config: Config): Promise<ScanResult> {
	const start = Date.now();

	// Load .gitignore
	const ig = ignore();
	try {
		const gitignore = readFileSync(`${cwd}/.gitignore`, 'utf-8');
		ig.add(gitignore);
	} catch {
		// no .gitignore, that's fine
	}
	ig.add(config.ignore);

	// Find all files
	const files = await fg('**/*', {
		cwd,
		dot: false,
		onlyFiles: true,
		ignore: config.ignore,
	});

	const pattern = buildPattern(config.tags);
	const todos: TodoWithBlame[] = [];
	let filesScanned = 0;

	for (const file of files) {
		if (isBinaryExtension(file)) continue;
		if (ig.ignores(file)) continue;

		const fullPath = `${cwd}/${file}`;

		try {
			const stat = statSync(fullPath);
			if (stat.size > config.maxFileSize) continue;
			if (stat.size === 0) continue;
		} catch {
			continue;
		}

		let content: string;
		try {
			content = readFileSync(fullPath, 'utf-8');
		} catch {
			continue;
		}

		// Quick check for binary content (null bytes in first 8KB)
		if (content.slice(0, 8192).includes('\0')) continue;

		filesScanned++;
		const lines = content.split('\n');

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const match = pattern.exec(line);
			if (!match) continue;

			const tag = match[1].toUpperCase();
			const parenContent = match[2]?.trim();
			const text = match[3]?.trim() || '';

			// Check if paren content is a date (expiration) or an assignee
			const isDate = parenContent && EXPIRATION_RE.test(parenContent);
			const assignee = parenContent && !isDate ? parenContent : undefined;

			const expMatch = EXPIRATION_RE.exec(parenContent ?? '') || EXPIRATION_RE.exec(text);

			const item: TodoWithBlame = {
				file: relative(cwd, fullPath),
				line: i + 1,
				tag,
				text,
				assignee,
				expiration: expMatch?.[1],
				raw: line.trim(),
			};

			// Try to get git blame info
			const blame = getBlameForLine(cwd, file, i + 1);
			if (blame) {
				item.author = blame.author;
				item.date = blame.date;
				item.ageDays = blame.ageDays;
			}

			todos.push(item);
		}
	}

	return {
		todos,
		filesScanned,
		duration: Date.now() - start,
	};
}

export function filterByDiff(todos: TodoWithBlame[], changedFiles: Set<string>): TodoWithBlame[] {
	return todos.filter(t => changedFiles.has(t.file));
}
