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

export const handle: Handle = handleI18n();
`);

// 4. i18n.ts config file
write('src/lib/i18n.ts', `import { defineConfig } from 'svelte-locale';

export default defineConfig({
\tlocales: ['en-US', 'sv-SE'],
\tdefaultLocale: 'en-US',
\tfallbackLocale: 'en-US',
\tcookieName: 'locale',
\trouting: {
\t\tstrategy: 'none',
\t\tprefixDefaultLocale: false
\t},
\tdetection: ['url', 'cookie', 'accept-language', 'default']
});
`);

// 5. vite.config.ts — add richI18n plugin if not present
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
				`plugins: [\n\t\trichI18n(),`
			);
			writeFileSync(abs, src, 'utf8');
			console.log(`  patch  vite.config.ts`);
		}
	} else {
		console.log(`  skip   vite.config.ts (not found)`);
	}
}

console.log('\nDone. Edit src/lib/i18n.ts to configure your locales.\n');
