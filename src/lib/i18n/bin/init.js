#!/usr/bin/env node
// @ts-nocheck
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

const cwd = process.cwd();

function write(rel, content) {
	const abs = join(cwd, rel);
	const dir = abs.slice(0, abs.lastIndexOf('/'));
	mkdirSync(dir, { recursive: true });
	if (existsSync(abs)) {
		console.log(`  skip   ${rel} (already exists)`);
	} else {
		writeFileSync(abs, content, 'utf8');
		console.log(`  create ${rel}`);
	}
}

function patch(rel, find, insert) {
	const abs = join(cwd, rel);
	if (!existsSync(abs)) {
		console.log(`  skip   ${rel} (file not found)`);
		return;
	}
	const src = readFileSync(abs, 'utf8');
	if (src.includes(insert.trim())) {
		console.log(`  skip   ${rel} (already patched)`);
		return;
	}
	const next = src.includes(find) ? src.replace(find, insert) : src + '\n' + insert;
	writeFileSync(abs, next, 'utf8');
	console.log(`  patch  ${rel}`);
}

console.log('\nsvelte-locale init\n');

// 1. app.html — replace lang="en" with placeholders
patch(
	'src/app.html',
	'lang="en"',
	'lang="%lang%" dir="%dir%"'
);

// 2. app.d.ts
write('src/app.d.ts', `// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
\tnamespace App {
\t\tinterface Locals {
\t\t\tlocale: import('svelte-locale').Locale;
\t\t}
\t}
}

export {};
`);

// 3. hooks.server.ts
write('src/hooks.server.ts', `import type { Handle } from '@sveltejs/kit';
import { handleI18n } from 'svelte-locale/server';
import '$lib/i18n/messages';
import '$lib/i18n/plurals';
import '$lib/i18n/functions';

export const handle: Handle = handleI18n();
`);

// 4. +layout.server.ts
write('src/routes/+layout.server.ts', `export const load = ({ locals }: { locals: App.Locals }) => ({
\tlocale: locals.locale
});
`);

// 5. +layout.ts
write('src/routes/+layout.ts', `import '$lib/i18n/messages';
import '$lib/i18n/plurals';
import '$lib/i18n/functions';
`);

// 6. +layout.svelte — only write if it doesn't already exist
write('src/routes/+layout.svelte', `<script lang="ts">
\timport { untrack } from 'svelte';
\timport { initLocale } from 'svelte-locale';
\timport type { Snippet } from 'svelte';

\tlet { data, children }: { data: { locale: import('svelte-locale').Locale }; children: Snippet } = $props();

\tuntrack(() => initLocale(data.locale));

\t$effect(() => {
\t\tinitLocale(data.locale);
\t});
</script>

{@render children()}
`);

// 7. Translation stubs
write('src/lib/i18n/messages.ts', `import { defineMessages } from 'svelte-locale';

defineMessages({
\ten: {
\t\t'common.save': 'Save',
\t\t'common.cancel': 'Cancel'
\t},
\tsv: {
\t\t'common.save': 'Spara',
\t\t'common.cancel': 'Avbryt'
\t}
});
`);

write('src/lib/i18n/plurals.ts', `import { definePlurals } from 'svelte-locale';

definePlurals({
\ten: {
\t\t'items.count': { one: '{count} item', other: '{count} items' }
\t},
\tsv: {
\t\t'items.count': { one: '{count} sak', other: '{count} saker' }
\t}
});
`);

write('src/lib/i18n/functions.ts', `import { createFn, defineFunctions } from 'svelte-locale';

export type AppFunctions = {
\t// 'example.fn': (input: { value: string }) => string;
};

defineFunctions({
\ten: {},
\tsv: {}
});

export const fn = createFn<AppFunctions>();
`);

// 8. vite.config.ts — add richI18n plugin if not present
{
	const abs = join(cwd, 'vite.config.ts');
	if (existsSync(abs)) {
		let src = readFileSync(abs, 'utf8');
		if (src.includes('richI18n')) {
			console.log(`  skip   vite.config.ts (already patched)`);
		} else {
			src = `import { richI18n } from 'svelte-locale/vite';\n` + src;
			src = src.replace(
				/plugins\s*:\s*\[/,
				`plugins: [\n\t\trichI18n({ locales: ['en', 'sv'] }),`
			);
			writeFileSync(abs, src, 'utf8');
			console.log(`  patch  vite.config.ts`);
		}
	} else {
		console.log(`  skip   vite.config.ts (not found)`);
	}
}

console.log('\nDone. Edit src/lib/i18n/messages.ts and add your locales to vite.config.ts.\n');
