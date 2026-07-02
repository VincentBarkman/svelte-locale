<script lang="ts">
	import type { Snippet } from 'svelte';
	import { i18nConfig, type Locale } from '../config.js';
	import { getLocaleName } from '../locales.js';
	import { getLocale, setLocale } from '../state.svelte.js';

	type ButtonSnippetProps = {
		locale: Locale;
		active: boolean;
		label: string;
		select: () => void;
	};

	type Props = {
		class?: string;
		style?: string;
		buttonClass?: string;
		buttonStyle?: string;
		button?: Snippet<[ButtonSnippetProps]>;
	};

	let {
		class: className,
		style,
		buttonClass,
		buttonStyle,
		button
	}: Props = $props();

	const activeLocale = $derived(getLocale());
</script>

<div role="group" aria-label="Language switcher" class={className} {style}>
	{#each i18nConfig.locales as locale (locale)}
		{@const active = activeLocale === locale}
		{@const label = getLocaleName(locale)}
		{@const select = () => setLocale(locale as Locale, { navigate: true })}
		{#if button}
			{@render button({ locale, active, label, select })}
		{:else}
			<button
				type="button"
				class={buttonClass}
				style={buttonStyle}
				aria-pressed={active}
				aria-label={`Switch to ${label}`}
				onclick={select}
			>
				{label}
			</button>
		{/if}
	{/each}
</div>
