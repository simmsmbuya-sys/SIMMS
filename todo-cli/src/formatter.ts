import chalk from 'chalk';
import { TodoWithBlame } from './types.js';

export type OutputFormat = 'pretty' | 'compact' | 'json' | 'count';

export function formatTodos(
	todos: TodoWithBlame[],
	format: OutputFormat,
	staleThresholdDays: number,
): string {
	switch (format) {
		case 'json':
			return JSON.stringify({ total: todos.length, todos }, null, 2);
		case 'compact':
			return todos
				.map(t => `${t.file}:${t.line}: ${t.tag} ${t.text}`)
				.join('\n');
		case 'count':
			return formatCount(todos);
		case 'pretty':
		default:
			return formatPretty(todos, staleThresholdDays);
	}
}

function formatCount(todos: TodoWithBlame[]): string {
	const counts = new Map<string, number>();
	for (const t of todos) {
		counts.set(t.tag, (counts.get(t.tag) ?? 0) + 1);
	}
	const lines: string[] = [];
	for (const [tag, count] of [...counts.entries()].sort((a, b) => b[1] - a[1])) {
		lines.push(`  ${tag.padEnd(10)} ${count}`);
	}
	lines.push(`  ${'Total'.padEnd(10)} ${todos.length}`);
	return lines.join('\n');
}

function colorTag(tag: string): string {
	switch (tag) {
		case 'FIXME':
		case 'BUG':
			return chalk.red.bold(tag);
		case 'HACK':
			return chalk.magenta.bold(tag);
		case 'XXX':
			return chalk.yellow.bold(tag);
		case 'TODO':
		default:
			return chalk.yellow.bold(tag);
	}
}

function formatAge(days: number | undefined, threshold: number): string {
	if (days === undefined) return '';
	const str = `${days}d`;
	if (days >= threshold) return chalk.red(str + ' ⚠');
	return chalk.dim(str);
}

function formatPretty(todos: TodoWithBlame[], staleThresholdDays: number): string {
	if (todos.length === 0) return chalk.green('No TODOs found.');

	// Group by file
	const grouped = new Map<string, TodoWithBlame[]>();
	for (const t of todos) {
		const list = grouped.get(t.file) ?? [];
		list.push(t);
		grouped.set(t.file, list);
	}

	const lines: string[] = [];
	const staleCount = todos.filter(t => (t.ageDays ?? 0) >= staleThresholdDays).length;
	const expiredCount = todos.filter(t => {
		if (!t.expiration) return false;
		return new Date(t.expiration) < new Date();
	}).length;

	for (const [file, items] of grouped) {
		lines.push(chalk.bold.cyan(file));
		for (const item of items) {
			const lineNum = chalk.dim(String(item.line).padStart(5));
			const tag = colorTag(item.tag);
			const assignee = item.assignee ? chalk.blue(`@${item.assignee}`) : '';
			const age = formatAge(item.ageDays, staleThresholdDays);
			const expired = item.expiration && new Date(item.expiration) < new Date()
				? chalk.red.bold(' EXPIRED')
				: '';

			const text = item.text.length > 60 ? item.text.slice(0, 57) + '...' : item.text;

			lines.push(
				`  ${lineNum} │ ${tag.padEnd(18)} ${text.padEnd(50)} ${assignee.padEnd(15)} ${age}${expired}`
			);
		}
		lines.push('');
	}

	// Summary
	const parts = [`${todos.length} TODOs across ${grouped.size} files`];
	if (staleCount > 0) parts.push(chalk.red(`${staleCount} stale`));
	if (expiredCount > 0) parts.push(chalk.red.bold(`${expiredCount} expired`));
	lines.push(chalk.dim(`── ${parts.join(' · ')} ──`));

	return lines.join('\n');
}

export function formatStats(todos: TodoWithBlame[], staleThresholdDays: number): string {
	const lines: string[] = [];
	const staleCount = todos.filter(t => (t.ageDays ?? 0) >= staleThresholdDays).length;
	const unassigned = todos.filter(t => !t.assignee).length;

	lines.push(chalk.bold('Summary'));
	lines.push(`  Total TODOs      ${todos.length}`);
	lines.push(`  Stale (>${staleThresholdDays}d)     ${staleCount}  ${bar(staleCount, todos.length)}`);
	lines.push(`  Unassigned       ${unassigned}  ${bar(unassigned, todos.length)}`);
	lines.push('');

	// By tag
	const tagCounts = new Map<string, number>();
	for (const t of todos) tagCounts.set(t.tag, (tagCounts.get(t.tag) ?? 0) + 1);

	lines.push(chalk.bold('By Tag'));
	for (const [tag, count] of [...tagCounts.entries()].sort((a, b) => b[1] - a[1])) {
		lines.push(`  ${tag.padEnd(12)} ${String(count).padStart(4)}  ${bar(count, todos.length)}`);
	}
	lines.push('');

	// By author
	const authorCounts = new Map<string, number>();
	for (const t of todos) {
		const author = t.author ?? t.assignee ?? 'unattributed';
		authorCounts.set(author, (authorCounts.get(author) ?? 0) + 1);
	}

	lines.push(chalk.bold('By Author'));
	for (const [author, count] of [...authorCounts.entries()].sort((a, b) => b[1] - a[1])) {
		lines.push(`  ${author.padEnd(16)} ${String(count).padStart(4)}  ${bar(count, todos.length)}`);
	}

	// Expired TODOs
	const expired = todos.filter(t => t.expiration && new Date(t.expiration) < new Date());
	if (expired.length > 0) {
		lines.push('');
		lines.push(chalk.red.bold(`${expired.length} expired TODO(s):`));
		for (const t of expired) {
			lines.push(chalk.red(`  ${t.file}:${t.line}  expires ${t.expiration}  ${t.text}`));
		}
	}

	return lines.join('\n');
}

function bar(value: number, total: number): string {
	if (total === 0) return '';
	const width = 20;
	const filled = Math.round((value / total) * width);
	const pct = Math.round((value / total) * 100);
	return chalk.green('█'.repeat(filled)) + chalk.dim('░'.repeat(width - filled)) + chalk.dim(` ${pct}%`);
}
