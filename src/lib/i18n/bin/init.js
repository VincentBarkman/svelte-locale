#!/usr/bin/env node
// @ts-nocheck
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';

const cwd = process.cwd();

console.log('\nsvelte-locale init\n');
console.log('Installing svelte-locale...');

await new Promise((resolve, reject) => {
	const proc = spawn('npm', ['install', 'svelte-locale'], { cwd, stdio: 'inherit' });
	proc.on('close', (code) => {
		if (code === 0) resolve();
		else reject(new Error('npm install exited with ' + code));
	});
});

console.log('\nSetting up files...\n');

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

// 1. app.html — replace lang="en" with placeholders
patch(
	'src/app.html',
	'lang="en"',
	'lang="%lang%" dir="%dir%"'
);

// 2. app.d.ts — patch locale into existing Locals interface, or write fresh if missing
{
	const abs = join(cwd, 'src/app.d.ts');
	const snippet = `locale: import('svelte-locale').Locale;`;
	if (!existsSync(abs)) {
		writeFileSync(abs, `// See https://svelte.dev/docs/kit/types#app.d.ts\ndeclare global {\n\tnamespace App {\n\t\tinterface Locals {\n\t\t\t${snippet}\n\t\t}\n\t}\n}\n\nexport {};\n`, 'utf8');
		console.log('  create src/app.d.ts');
	} else {
		let src = readFileSync(abs, 'utf8');
		if (src.includes(snippet)) {
			console.log('  skip   src/app.d.ts (already patched)');
		} else if (/\/\/\s*interface Locals/.test(src)) {
			// SvelteKit default: commented-out interface — replace the whole comment line
			src = src.replace(/\t*\/\/\s*interface Locals[^\n]*\n/, `\t\tinterface Locals {\n\t\t\t${snippet}\n\t\t}\n`);
			writeFileSync(abs, src, 'utf8');
			console.log('  patch  src/app.d.ts');
		} else if (src.includes('interface Locals {}')) {
			src = src.replace('interface Locals {}', `interface Locals {\n\t\t\t${snippet}\n\t\t}`);
			writeFileSync(abs, src, 'utf8');
			console.log('  patch  src/app.d.ts');
		} else if (src.includes('interface Locals {')) {
			src = src.replace('interface Locals {', `interface Locals {\n\t\t\t${snippet}`);
			writeFileSync(abs, src, 'utf8');
			console.log('  patch  src/app.d.ts');
		} else {
			src += `\ndeclare global {\n\tnamespace App {\n\t\tinterface Locals {\n\t\t\t${snippet}\n\t\t}\n\t}\n}\n`;
			writeFileSync(abs, src, 'utf8');
			console.log('  patch  src/app.d.ts');
		}
	}
}

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

// 6. +layout.svelte — write fresh or patch initLocale into existing file
{
	const abs = join(cwd, 'src/routes/+layout.svelte');
	const importSnippet = `import { untrack } from 'svelte';\n\timport { initLocale } from 'svelte-locale';`;
	const effectSnippet = `untrack(() => initLocale(data.locale));\n\n\t$effect(() => {\n\t\tinitLocale(data.locale);\n\t});`;
	if (!existsSync(abs)) {
		writeFileSync(abs, `<script lang="ts">\n\timport { untrack } from 'svelte';\n\timport { initLocale } from 'svelte-locale';\n\timport type { Snippet } from 'svelte';\n\n\tlet { data, children }: { data: { locale: import('svelte-locale').Locale }; children: Snippet } = $props();\n\n\tuntrack(() => initLocale(data.locale));\n\n\t$effect(() => {\n\t\tinitLocale(data.locale);\n\t});\n</script>\n\n{@render children()}\n`, 'utf8');
		console.log('  create src/routes/+layout.svelte');
	} else {
		let src = readFileSync(abs, 'utf8');
		if (src.includes('initLocale')) {
			console.log('  skip   src/routes/+layout.svelte (already patched)');
		} else {
			const hasScript = src.includes('<script');
			if (hasScript) {
				// Add imports after opening <script> tag
				src = src.replace(/<script([^>]*)>/, `<script$1>\n\t${importSnippet}`);
				// Replace $props() destructure with a fully typed version including data
				src = src.replace(
					/let\s*\{([^}]*)\}[^=\n]*=\s*\$props\(\)/,
					(m, props) => {
						const parts = props.split(',').map(p => p.trim()).filter(Boolean);
						if (!parts.includes('data')) parts.push('data');
						return `let { ${parts.join(', ')} }: { data: { locale: import('svelte-locale').Locale }; children: import('svelte').Snippet } = $props()`;
					}
				);
				// Inject effect before </script>
				const closeTag = src.lastIndexOf('</script>');
				src = src.slice(0, closeTag) + `\n\t${effectSnippet}\n` + src.slice(closeTag);
			} else {
				src = `<script lang="ts">\n\t${importSnippet}\n\t${effectSnippet}\n</script>\n\n` + src;
			}
			writeFileSync(abs, src, 'utf8');
			console.log('  patch  src/routes/+layout.svelte');
		}
	}
}

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
