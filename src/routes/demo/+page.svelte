<script lang="ts">
	import i18n from '$lib/i18n/namespace';
	import { t, plural, formatNumber } from '$lib/i18n/index';
	import { LocaleSwitcher, I18n } from '$lib/i18n/svelte';

	let count = $state(5);
	let amount = $state(99.99);
	let name = $state('World');
	let testDate = $state(new Date('2026-07-04'));
</script>

<svelte:head>
	<title>i18n Demo</title>
</svelte:head>

<div class="container">
	<h1>{i18n.t('demo.title')}</h1>
	<p>{i18n.t('demo.subtitle')}</p>

	<LocaleSwitcher class="locale-switcher">
		{#snippet button({ locale, active, label, select })}
			<button onclick={select} aria-pressed={active} style="font-weight: {active ? 'bold' : 'normal'}">
				{locale.toUpperCase()} — {label}
			</button>
		{/snippet}
	</LocaleSwitcher>

	<section>
		<h2>String Translations</h2>
		<p>Namespace API: {i18n.t('demo.greeting', { name })}</p>
		<p>Direct import: {t('demo.greeting', { name })}</p>
		<input type="text" bind:value={name} placeholder="Name" />
	</section>

	<section>
		<h2>Pluralization</h2>
		<p>Namespace API: {i18n.plural('demo.items', count)}</p>
		<p>Direct import: {plural('demo.items', count)}</p>
		<input type="number" bind:value={count} min="0" />
	</section>

	<section>
		<h2>Functions</h2>
		<p>Namespace API: {i18n.fn('demo.currency', amount)}</p>
		<input type="number" bind:value={amount} step="0.01" />
	</section>

	<section>
		<h2>Number Formatting</h2>
		<p>Namespace API: {i18n.formatNumber(1234567.89)}</p>
		<p>Direct import: {formatNumber(1234567.89)}</p>
		<p>Currency (USD): {i18n.formatCurrency(9.99, 'USD')}</p>
		<p>Currency (SEK): {i18n.formatCurrency(9.99, 'SEK')}</p>
	</section>

	<section>
		<h2>Date Formatting</h2>
		<p>Current date (long): {i18n.formatDate(new Date(), { dateStyle: 'long' })}</p>
		<p>Test date (long): {i18n.formatDate(testDate, { dateStyle: 'long' })}</p>
		<p>Test date (sv-SE): {i18n.formatDateForLocale(testDate, 'sv-SE', { dateStyle: 'long' })}</p>
		<p>ISO date: {i18n.formatDateISO(testDate)}</p>
		<p>ISO datetime: {i18n.formatDateTimeISO(testDate)}</p>
		<input type="date" bind:value={testDate} />
	</section>

	<section>
		<h2>Relative Time</h2>
		<p>2 days ago: {i18n.formatRelativeTime(-2, 'day')}</p>
		<p>1 hour from now: {i18n.formatRelativeTime(1, 'hour')}</p>
		<p>3 months ago: {i18n.formatRelativeTime(-3, 'month')}</p>
	</section>

	<section>
		<h2>Locale Info</h2>
		<p>Current locale: {i18n.getLocale()}</p>
		<p>Base locale: {i18n.getBaseLocale(i18n.getLocale())}</p>
		<p>Normalized: {i18n.normalizeLocale(i18n.getLocale())}</p>
		<p>Direction: {i18n.getLocaleDir(i18n.getLocale())}</p>
		<p>Name: {i18n.getLocaleName(i18n.getLocale())}</p>
	</section>

	<section>
		<h2>Components</h2>
		<LocaleSwitcher />
		<p>
			<I18n key="demo.greeting">
				<span lang="en-US">Hello, Component Test!</span>
				<span lang="sv-SE">Hej, Komponent Test!</span>
			</I18n>
		</p>
	</section>

	<section>
		<h2>Registry Functions</h2>
		<p>Get locale registry: {Object.keys(i18n.getLocaleRegistry()).length} locales registered</p>
	</section>

	<section>
		<h2>Routing Functions</h2>
		<p>Get locale from path: {i18n.getLocaleFromPath('/sv-SE/settings')}</p>
		<p>Strip locale prefix: {i18n.stripLocalePrefix('/en-US/settings')}</p>
	</section>
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	section {
		margin: 2rem 0;
		padding: 1rem;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
	}

	h1 {
		margin-bottom: 0.5rem;
	}

	h2 {
		margin-top: 0;
		font-size: 1.25rem;
	}

	input {
		margin-top: 0.5rem;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
</style>
