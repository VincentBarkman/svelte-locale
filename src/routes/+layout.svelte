<script lang="ts">
	import { untrack } from 'svelte';
	import i18n from '$lib/i18n/namespace';
	import type { Snippet } from 'svelte';
	// Import demo config before initializing locale
	import './demo/config';
	import './demo/messages';
	import './demo/plurals';
	import './demo/functions';

	let { data, children }: { data: { locale: string }; children: Snippet } = $props();

	untrack(() => i18n.initLocale(data.locale));

	$effect(() => {
		i18n.initLocale(data.locale);
	});
</script>

{@render children()}
