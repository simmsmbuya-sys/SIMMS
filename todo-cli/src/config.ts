import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { Config, DEFAULT_CONFIG } from './types.js';

export function loadConfig(cwd: string): Config {
	const configPath = join(cwd, '.todo-tracker.json');
	if (!existsSync(configPath)) {
		return { ...DEFAULT_CONFIG };
	}

	try {
		const raw = readFileSync(configPath, 'utf-8');
		const userConfig = JSON.parse(raw) as Partial<Config>;
		return {
			tags: userConfig.tags ?? DEFAULT_CONFIG.tags,
			ignore: [
				...DEFAULT_CONFIG.ignore,
				...(userConfig.ignore ?? []),
			],
			maxFileSize: userConfig.maxFileSize ?? DEFAULT_CONFIG.maxFileSize,
			staleThresholdDays: userConfig.staleThresholdDays ?? DEFAULT_CONFIG.staleThresholdDays,
		};
	} catch {
		return { ...DEFAULT_CONFIG };
	}
}
