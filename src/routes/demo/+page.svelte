<script lang="ts">
	import '../../demo/messages';
	import '../../demo/plurals';
	import '../../demo/functions';
	import i18n from '$lib/i18n/namespace';
	import { LocaleSwitcher } from 'svelte-locale/svelte';

	let count = $state(5);
	let amount = $state(99.99);
	let name = $state('World');
</script>

<svelte:head>
	<title>i18n Demo</title>
</svelte:head>

<div class="container">
	<h1>{i18n.t('demo.title')}</h1>
	<p>{i18n.t('demo.subtitle')}</p>

	<LocaleSwitcher />

	<section>
		<h2>String Translations</h2>
		<p>{i18n.t('demo.greeting', { name })}</p>
		<input type="text" bind:value={name} placeholder="Name" />
	</section>

	<section>
		<h2>Pluralization</h2>
		<p>{i18n.plural('demo.items', count)}</p>
		<input type="number" bind:value={count} min="0" />
	</section>

	<section>
		<h2>Functions</h2>
		<p>{i18n.fn('demo.currency', amount)}</p>
		<input type="number" bind:value={amount} step="0.01" />
	</section>

	<section>
		<h2>Number Formatting</h2>
		<p>{i18n.formatNumber(1234567.89)}</p>
		<p>{i18n.formatCurrency(9.99, 'USD')}</p>
	</section>

	<section>
		<h2>Date Formatting</h2>
		<p>{i18n.formatDate(new Date(), { dateStyle: 'long' })}</p>
		<p>{i18n.formatDateISO(new Date())}</p>
		<p>{i18n.formatDateTimeISO(new Date())}</p>
	</section>

	<section>
		<h2>Relative Time</h2>
		<p>{i18n.formatRelativeTime(-2, 'day')}</p>
		<p>{i18n.formatRelativeTime(1, 'hour')}</p>
	</section>

	<section>
		<h2>Locale Info</h2>
		<p>Current locale: {i18n.getLocale()}</p>
		<p>Base locale: {i18n.getBaseLocale(i18n.getLocale())}</p>
		<p>Normalized: {i18n.normalizeLocale(i18n.getLocale())}</p>
		<p>Direction: {i18n.getLocaleDir(i18n.getLocale())}</p>
		<p>Name: {i18n.getLocaleName(i18n.getLocale())}</p>
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
