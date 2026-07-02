<script lang="ts">
	import { untrack } from 'svelte';
	import { initLocale } from '$lib/i18n';
	import type { Snippet } from 'svelte';

	let { data, children }: { data: { locale: import('$lib/i18n').Locale }; children: Snippet } =
		$props();

	untrack(() => initLocale(data.locale));

	$effect(() => {
		initLocale(data.locale);
	});
</script>

{@render children()}
