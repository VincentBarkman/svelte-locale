<script lang="ts">
	import type { Snippet } from 'svelte';
	import { i18nConfig, type Locale } from '../config.js';
	import { getLocale } from '../state.svelte.js';

	const DEV = import.meta.env.DEV;

	type Props = {
		key: string;
		fallback?: Locale;
		as?: string;
		class?: string;
		style?: string;
		children?: Snippet;
		[lang: string]: Snippet<[]> | string | undefined;
	};

	let props: Props = $props();

	const wrapperTag = $derived(props.as ?? null);

	const activeLocale = $derived(getLocale());

	const activeSnippet = $derived.by(() => {
		// First check if locale snippets are passed as props (post-transform)
		const current = props[activeLocale];
		if (current && typeof current === 'function') return current as Snippet<[]>;

		// Fallback to props.fallback or i18nConfig.fallbackLocale
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
