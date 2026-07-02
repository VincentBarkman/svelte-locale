<script lang="ts">
	import { DEV } from 'esm-env';
	import type { Snippet } from 'svelte';
	import { i18nConfig, type Locale } from '../config.js';
	import { getLocale } from '../state.svelte.js';

	type Props = {
		key: string;
		fallback?: Locale;
		as?: string;
		class?: string;
		style?: string;
		[lang: string]: Snippet<[]> | string | undefined;
	};

	let props: Props = $props();

	const wrapperTag = $derived(props.as ?? null);

	const activeLocale = $derived(getLocale());

	const activeSnippet = $derived.by(() => {
		const current = props[activeLocale];
		if (current && typeof current === 'function') return current as Snippet<[]>;

		const fb = props.fallback ?? i18nConfig.fallbackLocale;
		const fallbackSnippet = props[fb];
		if (fallbackSnippet && typeof fallbackSnippet === 'function') {
			if (DEV) {
				console.warn(
					`[i18n] <I18n key="${props.key}"> is missing lang="${activeLocale}", rendering fallback "${fb}".`
				);
			}
			return fallbackSnippet as Snippet<[]>;
		}

		if (DEV) {
			console.warn(`[i18n] <I18n key="${props.key}"> has no renderable locale block.`);
		}
		return undefined;
	});
</script>

{#if activeSnippet}
	{#if wrapperTag}
		<svelte:element this={wrapperTag} class={props.class} style={props.style}>
			{@render activeSnippet()}
		</svelte:element>
	{:else}
		{@render activeSnippet()}
	{/if}
{/if}
