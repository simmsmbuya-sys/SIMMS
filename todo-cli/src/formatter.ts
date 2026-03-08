import chalk from 'chalk';
import { TodoWithBlame } from './types.js';

export type OutputFormat = 'pretty' | 'compact' | 'json' | 'count';

// ---------------------------------------------------------------------------
// Color mapping — lookup object instead of switch
// ---------------------------------------------------------------------------

const TAG_COLORS: Record<string, (text: string) => string> = {
	FIXME: chalk.red.bold,
	BUG: chalk.red.bold,
	HACK: chalk.magenta.bold,
	XXX: chalk.yellow.bold,
	TODO: chalk.yellow.bold,
};

const DEFAULT_TAG_COLOR = chalk.yellow.bold;

function colorTag(tag: string): string {
	return (TAG_COLORS[tag] ?? DEFAULT_TAG_COLOR)(tag);
}

// ---------------------------------------------------------------------------
// Terminal-width helpers
// ---------------------------------------------------------------------------

/** Returns the usable terminal width, falling back to 100 when unavailable. */
function terminalWidth(): number {
	return process.stdout.columns ?? 100;
}

// ---------------------------------------------------------------------------
// Reusable bar chart — width is now configurable
// ---------------------------------------------------------------------------

function bar(value: number, total: number, width = 20): string {
	if (total === 0) return '';
	const filled = Math.round((value / total) * width);
	const pct = Math.round((value / total) * 100);
	return (
		chalk.green('█'.repeat(filled)) +
		chalk.dim('░'.repeat(width - filled)) +
		chalk.dim(` ${pct}%`)
	);
}

// ---------------------------------------------------------------------------
// Shared filtering helpers (used by both formatPretty and formatStats)
// ---------------------------------------------------------------------------

function countStale(todos: TodoWithBlame[], thresholdDays: number): number {
	return todos.filter(t => (t.ageDays ?? 0) >= thresholdDays).length;
}

function filterExpired(todos: TodoWithBlame[]): TodoWithBlame[] {
	const now = new Date();
	return todos.filter(t => t.expiration !== undefined && new Date(t.expiration) < now);
}

// ---------------------------------------------------------------------------
// Grouping logic (extracted from formatPretty)
// ---------------------------------------------------------------------------

function groupByFile(todos: TodoWithBlame[]): Map<string, TodoWithBlame[]> {
	const grouped = new Map<string, TodoWithBlame[]>();
	for (const t of todos) {
		const list = grouped.get(t.file) ?? [];
		list.push(t);
		grouped.set(t.file, list);
	}
	return grouped;
}

// ---------------------------------------------------------------------------
// Age formatting
// ---------------------------------------------------------------------------

function formatAge(days: number | undefined, threshold: number): string {
	if (days === undefined) return '';
	const str = `${days}d`;
	if (days >= threshold) return chalk.red(str + ' ⚠');
	return chalk.dim(str);
}

// ---------------------------------------------------------------------------
// Single-item formatting (extracted from formatPretty)
// ---------------------------------------------------------------------------

interface ColumnWidths {
	tag: number;
	text: number;
	assignee: number;
}

/**
 * Compute column widths dynamically based on actual content and the available
 * terminal width.  The layout is:
 *
 *   "  " + lineNum(5) + " │ " + tag + " " + text + " " + assignee + " " + age/expired
 *
 * Fixed overhead: 2 (indent) + 5 (lineNum) + 3 (│ + spaces) + 3 (inter-col spaces) = 13
 * We reserve 12 chars for the age/expired suffix.
 */
function computeColumnWidths(items: TodoWithBlame[]): ColumnWidths {
	const maxTagLen = Math.max(...items.map(i => i.tag.length), 4);
	const maxAssigneeLen = Math.max(
		...items.map(i => (i.assignee ? i.assignee.length + 1 : 0)), // +1 for "@"
		0,
	);

	const fixedOverhead = 13;
	const ageSuffix = 12;
	const available = terminalWidth() - fixedOverhead - ageSuffix;

	// Tag and assignee get their natural width; text fills the remainder.
	const tag = maxTagLen;
	const assignee = maxAssigneeLen;
	const text = Math.max(available - tag - assignee, 20);

	return { tag, text, assignee };
}

function formatItem(
	item: TodoWithBlame,
	widths: ColumnWidths,
	staleThresholdDays: number,
): string {
	const lineNum = chalk.dim(String(item.line).padStart(5));
	const tag = colorTag(item.tag);
	const assignee = item.assignee ? chalk.blue(`@${item.assignee}`) : '';
	const age = formatAge(item.ageDays, staleThresholdDays);
	const expired =
		item.expiration && new Date(item.expiration) < new Date()
			? chalk.red.bold(' EXPIRED')
			: '';

	const truncatedText =
		item.text.length > widths.text
			? item.text.slice(0, widths.text - 3) + '...'
			: item.text;

	// Pad using the raw (un-styled) length so ANSI codes don't skew alignment.
	const tagPad = widths.tag - item.tag.length;
	const textPad = widths.text - truncatedText.length;
	const assigneePad = widths.assignee - (item.assignee ? item.assignee.length + 1 : 0);

	return (
		`  ${lineNum} │ ` +
		`${tag}${' '.repeat(Math.max(tagPad, 0))} ` +
		`${truncatedText}${' '.repeat(Math.max(textPad, 0))} ` +
		`${assignee}${' '.repeat(Math.max(assigneePad, 0))} ` +
		`${age}${expired}`
	);
}

// ---------------------------------------------------------------------------
// Summary generation (extracted from formatPretty)
// ---------------------------------------------------------------------------

function formatSummary(
	totalCount: number,
	fileCount: number,
	staleCount: number,
	expiredCount: number,
): string {
	const parts = [`${totalCount} TODOs across ${fileCount} files`];
	if (staleCount > 0) parts.push(chalk.red(`${staleCount} stale`));
	if (expiredCount > 0) parts.push(chalk.red.bold(`${expiredCount} expired`));
	return chalk.dim(`── ${parts.join(' · ')} ──`);
}

// ---------------------------------------------------------------------------
// Pretty formatter (now delegates to focused helpers)
// ---------------------------------------------------------------------------

function formatPretty(todos: TodoWithBlame[], staleThresholdDays: number): string {
	if (todos.length === 0) return chalk.green('No TODOs found.');

	const grouped = groupByFile(todos);
	const staleCount = countStale(todos, staleThresholdDays);
	const expiredCount = filterExpired(todos).length;

	// Pre-compute column widths once across all items.
	const widths = computeColumnWidths(todos);

	const lines: string[] = [];

	for (const [file, items] of grouped) {
		lines.push(chalk.bold.cyan(file));
		for (const item of items) {
			lines.push(formatItem(item, widths, staleThresholdDays));
		}
		lines.push('');
	}

	lines.push(formatSummary(todos.length, grouped.size, staleCount, expiredCount));

	return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Count formatter
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Stats formatter (uses shared filtering helpers)
// ---------------------------------------------------------------------------

export function formatStats(todos: TodoWithBlame[], staleThresholdDays: number): string {
	const lines: string[] = [];
	const staleCount = countStale(todos, staleThresholdDays);
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

	// Expired TODOs — uses shared filterExpired()
	const expired = filterExpired(todos);
	if (expired.length > 0) {
		lines.push('');
		lines.push(chalk.red.bold(`${expired.length} expired TODO(s):`));
		for (const t of expired) {
			lines.push(chalk.red(`  ${t.file}:${t.line}  expires ${t.expiration}  ${t.text}`));
		}
	}

	return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

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
