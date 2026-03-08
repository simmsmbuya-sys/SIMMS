#!/usr/bin/env node

import { Command } from 'commander';
import { loadConfig } from './config.js';
import { scanFiles, filterByDiff } from './scanner.js';
import { getChangedFiles } from './git.js';
import { formatTodos, formatStats, OutputFormat } from './formatter.js';

const program = new Command();

program
	.name('todo-tracker')
	.description('Track TODO comments across your codebase')
	.version('1.0.0');

// ── list ────────────────────────────────────────────────────

program
	.command('list')
	.alias('ls')
	.description('List all TODO comments in the codebase')
	.option('-f, --format <format>', 'Output format: pretty, compact, json, count', 'pretty')
	.option('-t, --tag <tags>', 'Filter by tags (comma-separated)')
	.option('-a, --assignee <name>', 'Filter by assignee')
	.option('--stale <days>', 'Only show TODOs older than N days')
	.option('--file <glob>', 'Filter by file glob pattern')
	.action(async (opts) => {
		const cwd = process.cwd();
		const config = loadConfig(cwd);
		const result = await scanFiles(cwd, config);
		let todos = result.todos;

		if (opts.tag) {
			const tags = new Set(opts.tag.split(',').map((s: string) => s.trim().toUpperCase()));
			todos = todos.filter(t => tags.has(t.tag));
		}
		if (opts.assignee) {
			todos = todos.filter(t => t.assignee?.toLowerCase() === opts.assignee.toLowerCase());
		}
		if (opts.stale) {
			const days = parseInt(opts.stale, 10);
			todos = todos.filter(t => (t.ageDays ?? 0) >= days);
		}

		console.log(formatTodos(todos, opts.format as OutputFormat, config.staleThresholdDays));
		console.log(`\nScanned ${result.filesScanned} files in ${result.duration}ms`);
	});

// ── stats ───────────────────────────────────────────────────

program
	.command('stats')
	.description('Show TODO statistics and breakdown')
	.action(async () => {
		const cwd = process.cwd();
		const config = loadConfig(cwd);
		const result = await scanFiles(cwd, config);
		console.log(formatStats(result.todos, config.staleThresholdDays));
		console.log(`\nScanned ${result.filesScanned} files in ${result.duration}ms`);
	});

// ── check ───────────────────────────────────────────────────

program
	.command('check')
	.description('CI enforcement: exit non-zero if policy violated')
	.option('--max <n>', 'Fail if more than N TODOs')
	.option('--no-stale <days>', 'Fail if any TODO older than N days')
	.option('--no-expired', 'Fail if any TODO has passed its expiration date')
	.option('--no-unassigned', 'Fail if any TODO lacks an assignee')
	.option('--no-tags <tags>', 'Fail if any of these tags exist (comma-separated)')
	.option('--diff <base>', 'Only check TODOs in files changed since base branch')
	.option('-f, --format <format>', 'Output format: pretty, compact, json', 'pretty')
	.action(async (opts) => {
		const cwd = process.cwd();
		const config = loadConfig(cwd);
		const result = await scanFiles(cwd, config);
		let todos = result.todos;

		// Scope to diff if requested
		if (opts.diff) {
			const changedFiles = getChangedFiles(cwd, opts.diff);
			todos = filterByDiff(todos, changedFiles);
		}

		const violations: string[] = [];

		if (opts.max !== undefined) {
			const max = parseInt(opts.max, 10);
			if (todos.length > max) {
				violations.push(`Too many TODOs: ${todos.length} (max: ${max})`);
			}
		}

		if (opts.stale !== undefined && opts.stale !== true) {
			const days = parseInt(opts.stale as string, 10);
			const stale = todos.filter(t => (t.ageDays ?? 0) >= days);
			if (stale.length > 0) {
				violations.push(`${stale.length} stale TODO(s) (>${days} days):`);
				for (const t of stale) {
					violations.push(`  ${t.file}:${t.line}  ${t.tag} ${t.text} (${t.ageDays}d)`);
				}
			}
		}

		if (opts.expired === false) {
			const expired = todos.filter(t => t.expiration && new Date(t.expiration) < new Date());
			if (expired.length > 0) {
				violations.push(`${expired.length} expired TODO(s):`);
				for (const t of expired) {
					violations.push(`  ${t.file}:${t.line}  expires ${t.expiration}  ${t.text}`);
				}
			}
		}

		if (opts.unassigned === false) {
			const unassigned = todos.filter(t => !t.assignee);
			if (unassigned.length > 0) {
				violations.push(`${unassigned.length} unassigned TODO(s):`);
				for (const t of unassigned.slice(0, 10)) {
					violations.push(`  ${t.file}:${t.line}  ${t.tag} ${t.text}`);
				}
				if (unassigned.length > 10) {
					violations.push(`  ... and ${unassigned.length - 10} more`);
				}
			}
		}

		if (opts.tags !== undefined && opts.tags !== true) {
			const banned = new Set((opts.tags as string).split(',').map(s => s.trim().toUpperCase()));
			const found = todos.filter(t => banned.has(t.tag));
			if (found.length > 0) {
				violations.push(`${found.length} prohibited tag(s):`);
				for (const t of found) {
					violations.push(`  ${t.file}:${t.line}  ${t.tag} ${t.text}`);
				}
			}
		}

		if (violations.length > 0) {
			console.error('todo-tracker: policy violation\n');
			console.error(violations.join('\n'));
			process.exit(2);
		}

		console.log(`todo-tracker: all checks passed (${todos.length} TODOs in ${result.filesScanned} files)`);
	});

// ── diff ────────────────────────────────────────────────────

program
	.command('diff <base>')
	.description('Show TODOs only in files changed since base branch')
	.option('-f, --format <format>', 'Output format: pretty, compact, json', 'pretty')
	.action(async (base, opts) => {
		const cwd = process.cwd();
		const config = loadConfig(cwd);
		const result = await scanFiles(cwd, config);
		const changedFiles = getChangedFiles(cwd, base);
		const todos = filterByDiff(result.todos, changedFiles);

		if (todos.length === 0) {
			console.log(`No TODOs in changed files (vs ${base})`);
			return;
		}

		console.log(`TODOs in files changed since ${base}:\n`);
		console.log(formatTodos(todos, opts.format as OutputFormat, config.staleThresholdDays));
	});

// ── init ────────────────────────────────────────────────────

program
	.command('init')
	.description('Create a .todo-tracker.json config file')
	.action(async () => {
		const { writeFileSync, existsSync } = await import('node:fs');
		const path = '.todo-tracker.json';
		if (existsSync(path)) {
			console.log('.todo-tracker.json already exists');
			return;
		}
		const config = {
			tags: ['TODO', 'FIXME', 'HACK', 'XXX', 'BUG'],
			ignore: [],
			maxFileSize: 1048576,
			staleThresholdDays: 90,
		};
		writeFileSync(path, JSON.stringify(config, null, 2) + '\n');
		console.log('Created .todo-tracker.json with defaults');
	});

program.parse();
