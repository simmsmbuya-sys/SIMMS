export interface TodoItem {
	file: string;
	line: number;
	tag: string;
	text: string;
	assignee?: string;
	expiration?: string; // ISO date string
	raw: string;
}

export interface TodoWithBlame extends TodoItem {
	author?: string;
	date?: string;
	ageDays?: number;
}

export interface ScanResult {
	todos: TodoWithBlame[];
	filesScanned: number;
	duration: number;
}

export interface Config {
	tags: string[];
	ignore: string[];
	maxFileSize: number;
	staleThresholdDays: number;
}

export const DEFAULT_CONFIG: Config = {
	tags: ['TODO', 'FIXME', 'HACK', 'XXX', 'BUG'],
	ignore: [
		'node_modules/**',
		'vendor/**',
		'.git/**',
		'dist/**',
		'build/**',
		'coverage/**',
		'*.min.js',
		'*.min.css',
		'*.map',
		'package-lock.json',
		'yarn.lock',
		'pnpm-lock.yaml',
	],
	maxFileSize: 1_048_576, // 1MB
	staleThresholdDays: 90,
};
