import { execSync } from 'node:child_process';

export interface BlameInfo {
	author: string;
	date: string;
	ageDays: number;
}

const DEFAULT_TIMEOUT = 10_000;

/**
 * Run a git command, returning its stdout or null on failure.
 */
function gitExec(command: string, cwd: string, timeout = DEFAULT_TIMEOUT): string | null {
	try {
		return execSync(command, {
			cwd,
			timeout,
			encoding: 'utf-8',
			stdio: ['pipe', 'pipe', 'pipe'],
		});
	} catch {
		return null;
	}
}

/**
 * Parse full porcelain blame output into a map of line numbers to BlameInfo.
 * Porcelain format emits blocks per line; each block starts with a commit hash
 * and line numbers, followed by header lines like `author`, `author-time`, etc.
 */
function parsePorcelainBlame(output: string): Map<number, BlameInfo> {
	const result = new Map<number, BlameInfo>();
	const blocks = output.split(/(?=^[0-9a-f]{40} )/m);

	for (const block of blocks) {
		if (!block.trim()) continue;

		// First line: <hash> <orig-line> <final-line> [<num-lines>]
		const headerMatch = block.match(/^[0-9a-f]{40} \d+ (\d+)/);
		if (!headerMatch) continue;

		const lineNumber = parseInt(headerMatch[1], 10);

		const authorMatch = block.match(/^author (.+)$/m);
		const dateMatch = block.match(/^author-time (\d+)$/m);
		if (!authorMatch || !dateMatch) continue;

		const timestamp = parseInt(dateMatch[1], 10) * 1000;
		const date = new Date(timestamp);
		const ageDays = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));

		result.set(lineNumber, {
			author: authorMatch[1],
			date: date.toISOString().slice(0, 10),
			ageDays,
		});
	}

	return result;
}

/**
 * Get blame info for every line in a file. Returns a Map keyed by 1-based line number.
 */
export function getBlameForFile(cwd: string, file: string): Map<number, BlameInfo> {
	const output = gitExec(`git blame --porcelain -- "${file}"`, cwd);
	if (!output) return new Map();
	return parsePorcelainBlame(output);
}

/**
 * Get blame info for a single line. Kept for backward compatibility but
 * prefer `getBlameForFile` for batch lookups.
 */
export function getBlameForLine(cwd: string, file: string, line: number): BlameInfo | null {
	const output = gitExec(`git blame -L ${line},${line} --porcelain -- "${file}"`, cwd);
	if (!output) return null;

	const authorMatch = output.match(/^author (.+)$/m);
	const dateMatch = output.match(/^author-time (\d+)$/m);
	if (!authorMatch || !dateMatch) return null;

	const timestamp = parseInt(dateMatch[1], 10) * 1000;
	const date = new Date(timestamp);
	const ageDays = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));

	return {
		author: authorMatch[1],
		date: date.toISOString().slice(0, 10),
		ageDays,
	};
}

/**
 * Try a series of git commands in order, returning the result of the first
 * one that succeeds, or null if all fail.
 */
function tryCommands(cwd: string, commands: string[], timeout = DEFAULT_TIMEOUT): string | null {
	for (const cmd of commands) {
		const result = gitExec(cmd, cwd, timeout);
		if (result !== null) return result;
	}
	return null;
}

export function getChangedFiles(cwd: string, base: string): Set<string> {
	const result = tryCommands(cwd, [
		`git diff --name-only ${base}...HEAD`,
		`git diff --name-only ${base}`,
	]);
	if (!result) return new Set();
	return new Set(result.trim().split('\n').filter(Boolean));
}

export function isGitRepo(cwd: string): boolean {
	return gitExec('git rev-parse --is-inside-work-tree', cwd) !== null;
}

/**
 * Get the current git branch name, or null if not in a git repo / detached HEAD.
 */
export function getCurrentBranch(cwd: string): string | null {
	const result = gitExec('git rev-parse --abbrev-ref HEAD', cwd);
	if (!result) return null;
	const branch = result.trim();
	return branch === 'HEAD' ? null : branch; // detached HEAD returns literal "HEAD"
}
