<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import type { Locale } from '../config.js';
	import { withLocale } from '../route.js';

	type Props = Omit<HTMLAnchorAttributes, 'href'> & {
		href: string;
		locale?: Locale;
	};

	let { href, locale, class: className, children, ...rest }: Props = $props();

	const resolvedHref = $derived(withLocale(href, locale));
</script>

<a href={resolvedHref} class={className} {...rest}>
	{@render children?.()}
</a>
