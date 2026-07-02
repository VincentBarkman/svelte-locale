import { parse } from 'svelte/compiler';
import MagicString from 'magic-string';
import type { Plugin } from 'vite';

export interface RichI18nOptions {
	locales?: readonly string[];
}

interface LangChild {
	lang: string;
	start: number;
	end: number;
}

type SvelteNode = {
	type: string;
	start: number;
	end: number;
	name?: string;
	attributes?: SvelteAttribute[];
	children?: SvelteNode[];
	fragment?: { nodes: SvelteNode[] };
};

type SvelteAttribute = {
	type: string;
	name: string;
	value: Array<{ type: string; data?: string }> | true;
};

function getAttrValue(node: SvelteNode, attrName: string): string | undefined {
	const attr = node.attributes?.find((a) => a.name === attrName);
	if (!attr || attr.value === true) return undefined;
	const text = attr.value.find((v) => v.type === 'Text');
	return text?.data;
}

function findI18nNodes(nodes: SvelteNode[]): SvelteNode[] {
	const found: SvelteNode[] = [];
	for (const node of nodes) {
		if (node.type === 'Component' && node.name === 'I18n') {
			found.push(node);
		}
		const children = node.fragment?.nodes ?? node.children ?? [];
		found.push(...findI18nNodes(children));
	}
	return found;
}

interface TransformResult {
	code: string;
	map: ReturnType<MagicString['generateMap']>;
}

function transformI18nBlock(src: string, id: string, validLocales: Set<string>): TransformResult | null {
	let ast: ReturnType<typeof parse>;
	try {
		ast = parse(src, { filename: id });
	} catch {
		return null;
	}

	const fragment = (ast as unknown as { fragment: { nodes: SvelteNode[] } }).fragment;
	if (!fragment) return null;

	const i18nNodes = findI18nNodes(fragment.nodes);
	if (i18nNodes.length === 0) return null;

	const isDev = process.env.NODE_ENV !== 'production';
	const ms = new MagicString(src);

	for (const node of i18nNodes) {
		const i18nKey = getAttrValue(node, 'key') ?? 'unknown';
		const children = node.fragment?.nodes ?? node.children ?? [];

		const langChildren: LangChild[] = [];
		for (const child of children) {
			if (child.type !== 'RegularElement' && child.type !== 'Element') continue;
			const lang = getAttrValue(child, 'lang');
			if (!lang) continue;
			langChildren.push({ lang, start: child.start, end: child.end });
		}

		if (langChildren.length === 0) continue;

		const seenLangs = new Set<string>();
		const warnings: string[] = [];

		for (const child of langChildren) {
			if (validLocales.size > 0 && !validLocales.has(child.lang)) {
				warnings.push(
					`[i18n] Invalid lang="${child.lang}" in <I18n key="${i18nKey}">. Valid: ${[...validLocales].join(', ')}.`
				);
			}
			if (seenLangs.has(child.lang)) {
				warnings.push(`[i18n] Duplicate lang="${child.lang}" in <I18n key="${i18nKey}">.`);
			}
			seenLangs.add(child.lang);
		}

		for (const locale of validLocales) {
			if (!seenLangs.has(locale)) {
				warnings.push(`[i18n] <I18n key="${i18nKey}"> is missing lang="${locale}".`);
			}
		}

		if (isDev) {
			for (const w of warnings) console.warn(w);
		}

		const attrsStr = src
			.slice(node.start + '<I18n'.length, langChildren[0].start)
			.trim()
			.replace(/>\s*$/, '')
			.trimEnd();

		const snippetBlocks = langChildren
			.map((c) => `{#snippet ${c.lang}()}\n\t\t\t${src.slice(c.start, c.end).trim()}\n\t\t{/snippet}`)
			.join('\n\t\t');

		const replacement = `<I18n ${attrsStr}>\n\t\t${snippetBlocks}\n\t</I18n>`;
		ms.overwrite(node.start, node.end, replacement);
	}

	if (!ms.hasChanged()) return null;

	return {
		code: ms.toString(),
		map: ms.generateMap({ source: id, includeContent: true, hires: true })
	};
}

export function richI18n(options: RichI18nOptions = {}): Plugin {
	const validLocales = new Set<string>(options.locales ?? []);

	return {
		name: 'vite-plugin-svelte-i18n',
		enforce: 'pre',

		transform(code, id) {
			if (!id.endsWith('.svelte')) return;
			if (!code.includes('<I18n')) return;

			const result = transformI18nBlock(code, id, validLocales);
			if (!result) return;

			return { code: result.code, map: result.map };
		}
	};
}
