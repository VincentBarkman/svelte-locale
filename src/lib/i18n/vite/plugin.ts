import MagicString from 'magic-string';
import type { Plugin } from 'vite';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

export interface RichI18nOptions {
	locales?: readonly string[];
	configPath?: string;
}

function discoverConfigLocales(root: string, configPath?: string): string[] {
	const paths = [
		configPath,
		'src/lib/i18n.ts',
		'src/i18n.ts',
		'src/lib/i18n/index.ts',
		'src/i18n/index.ts'
	].filter(Boolean) as string[];

	for (const path of paths) {
		const absPath = resolve(root, path);
		if (existsSync(absPath)) {
			try {
				const content = readFileSync(absPath, 'utf8');
				const localesMatch = content.match(/locales:\s*\[([^\]]+)\]/);
				if (localesMatch) {
					const localesStr = localesMatch[1];
					const locales = localesStr
						.split(',')
						.map((s) => s.trim().replace(/['"]/g, ''))
						.filter(Boolean);
					if (locales.length > 0) return locales;
				}
			} catch {
			}
		}
	}

	return [];
}

interface TransformResult {
	code: string;
	map: ReturnType<MagicString['generateMap']>;
}

function transformI18nBlock(src: string, id: string, validLocales: Set<string>): TransformResult | null {
	try {
		const i18nRegex = /<I18n([^>]*)>([\s\S]*?)<\/I18n>/g;
		const matches = Array.from(src.matchAll(i18nRegex))
			.sort((a, b) => b.index - a.index);

		if (matches.length === 0) return null;

		const ms = new MagicString(src);
		const usedSnippetNames = new Set<string>();

		for (const match of matches) {
			const [fullMatch, attrs, content] = match;
			const keyMatch = attrs.match(/key="([^"]+)"/);
			if (!keyMatch) {
				console.warn(`[i18n] <I18n> component in ${id} is missing required "key" attribute. Skipping transformation.`);
				continue;
			}

			const key = keyMatch[1];

			const langRegex = /<([^>\s\/]+)([^>]*)\s+lang="([^"]+)"([^>]*)(?:\/>|>([\s\S]*?)<\/\1>)/g;
			const langMatches = Array.from(content.matchAll(langRegex));

			if (langMatches.length === 0) {
				console.warn(`[i18n] <I18n key="${key}"> in ${id} has no lang-attribute children. Skipping transformation.`);
				continue;
			}

			const duplicateLangs = new Set<string>();
			for (const [, , , lang] of langMatches) {
				if (duplicateLangs.has(lang)) {
					console.warn(`[i18n] Duplicate lang="${lang}" in <I18n key="${key}"> in ${id}. Only the first will be used.`);
				}
				duplicateLangs.add(lang);
				if (validLocales.size > 0 && !validLocales.has(lang)) {
					console.warn(`[i18n] Invalid locale "${lang}" in <I18n key="${key}"> in ${id}. Valid locales: ${Array.from(validLocales).join(', ')}`);
				}
			}

			const localeToSnippetName = new Map<string, string>();
			for (const [, , , lang] of langMatches) {
				let snippetName = lang.replace(/-/g, '_');
				if (!/^[a-zA-Z_]/.test(snippetName)) {
					snippetName = `locale_${snippetName}`;
				}
				
				let finalSnippetName = snippetName;
				let counter = 1;
				while (usedSnippetNames.has(finalSnippetName)) {
					finalSnippetName = `${snippetName}_${counter}`;
					counter++;
				}
				usedSnippetNames.add(finalSnippetName);
				localeToSnippetName.set(lang, finalSnippetName);
			}

			const snippetDefinitions = langMatches.map(([, tag, otherAttrs, lang, trailingAttrs, innerContent]) => {
				const snippetName = localeToSnippetName.get(lang)!;
				const allAttrs = `lang="${lang}"${otherAttrs}${trailingAttrs}`;
				
				if (innerContent) {
					return `{#snippet ${snippetName}()}<${tag} ${allAttrs}>${innerContent}</${tag}>{/snippet}`;
				} else {
					return `{#snippet ${snippetName}()}<${tag} ${allAttrs} />{/snippet}`;
				}
			}).join('\n\t');

			const localePropsList = langMatches.map(([, , , lang]) => {
				const snippetName = localeToSnippetName.get(lang)!;
				return `${lang}={${snippetName}}`;
			}).join(' ');

			const openingTag = `<I18n${attrs} ${localePropsList} />`;
			const transformedContent = `${snippetDefinitions}\n\t${openingTag}`;

			const startIndex = match.index;
			const endIndex = match.index + fullMatch.length;

			ms.overwrite(startIndex, endIndex, transformedContent);
		}

		return {
			code: ms.toString(),
			map: ms.generateMap({ hires: true })
		};
	} catch (e) {
		console.error(`[i18n] Plugin transformation error in ${id}:`, e);
		return null;
	}
}

export function richI18n(options: RichI18nOptions = {}): Plugin {
	let validLocales: Set<string>;

	return {
		name: 'vite-plugin-svelte-i18n',
		enforce: 'pre',

		configResolved(config) {
			const discovered = discoverConfigLocales(config.root, options.configPath);
			const explicit = options.locales ?? [];
			validLocales = new Set<string>(explicit.length > 0 ? explicit : discovered);
		},

		transform(code, id) {
			if (!id.endsWith('.svelte')) return;
			if (!code.includes('<I18n')) return;

			const result = transformI18nBlock(code, id, validLocales);
			if (!result) return;

			return { code: result.code, map: result.map };
		}
	};
}
