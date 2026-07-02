<script lang="ts">
	import type { Locale } from '../config.js';
	import { i18nConfig } from '../config.js';
	import { withLocale } from '../route.js';

	type ExtraLocale = {
		hreflang: string;
		locale: Locale;
	};

	type Props = {
		pathname: string;
		origin?: string;
		xDefault?: boolean;
		extraLocales?: ExtraLocale[];
	};

	let { pathname, origin = '', xDefault = true, extraLocales = [] }: Props = $props();
</script>

<svelte:head>
	{#each i18nConfig.locales as locale (locale)}
		<link
			rel="alternate"
			hreflang={locale}
			href={`${origin}${withLocale(pathname, locale)}`}
		/>
	{/each}
	{#each extraLocales as extra (extra.hreflang)}
		<link
			rel="alternate"
			hreflang={extra.hreflang}
			href={`${origin}${withLocale(pathname, extra.locale)}`}
		/>
	{/each}
	{#if xDefault}
		<link
			rel="alternate"
			hreflang="x-default"
			href={`${origin}${withLocale(pathname, i18nConfig.defaultLocale)}`}
		/>
	{/if}
</svelte:head>
