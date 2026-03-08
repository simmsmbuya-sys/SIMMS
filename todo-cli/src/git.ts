import { execSync } from 'node:child_process';

export interface BlameInfo {
	author: string;
	date: string;
	ageDays: number;
}

export function getBlameForLine(cwd: string, file: string, line: number): BlameInfo | null {
	try {
		const result = execSync(
			`git blame -L ${line},${line} --porcelain -- "${file}"`,
			{ cwd, encoding: 'utf-8', timeout: 5000, stdio: ['pipe', 'pipe', 'pipe'] }
		);
		const authorMatch = result.match(/^author (.+)$/m);
		const dateMatch = result.match(/^author-time (\d+)$/m);

		if (!authorMatch || !dateMatch) return null;

		const timestamp = parseInt(dateMatch[1], 10) * 1000;
		const date = new Date(timestamp);
		const ageDays = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));

		return {
			author: authorMatch[1],
			date: date.toISOString().slice(0, 10),
			ageDays,
		};
	} catch {
		return null;
	}
}

export function getChangedFiles(cwd: string, base: string): Set<string> {
	try {
		const result = execSync(
			`git diff --name-only ${base}...HEAD`,
			{ cwd, encoding: 'utf-8', timeout: 10000, stdio: ['pipe', 'pipe', 'pipe'] }
		);
		return new Set(result.trim().split('\n').filter(Boolean));
	} catch {
		// Fallback: try without merge-base
		try {
			const result = execSync(
				`git diff --name-only ${base}`,
				{ cwd, encoding: 'utf-8', timeout: 10000, stdio: ['pipe', 'pipe', 'pipe'] }
			);
			return new Set(result.trim().split('\n').filter(Boolean));
		} catch {
			return new Set();
		}
	}
}

export function isGitRepo(cwd: string): boolean {
	try {
		execSync('git rev-parse --is-inside-work-tree', {
			cwd, encoding: 'utf-8', timeout: 3000, stdio: ['pipe', 'pipe', 'pipe'],
		});
		return true;
	} catch {
		return false;
	}
}
