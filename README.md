# svelte-locale

A stupid-simple, SvelteKit-native i18n library for Svelte 5.

## Features

- `t()` — type-safe string translations with interpolation
- `plural()` — count-based translations via `Intl.PluralRules`
- `fn()` — logic-based translations with typed inputs/outputs
- `<I18n>` — server-first rich component translations (no hidden DOM)
- `<LocaleLink>` — locale-aware `<a>` tags
- `<LocaleSwitcher>` — accessible language switcher
- Vite plugin that transforms `<I18n>` children into snippets automatically
- Server locale detection: URL → cookie → `Accept-Language` → default
- RTL support via `<html dir>`
- Zero flicker, server-selected language

## Installation

```bash
npm install svelte-locale
```

## Setup

### `vite.config.ts`

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import { richI18n } from 'svelte-locale/vite';
import { i18nConfig } from '$lib/i18n/config';

export default {
  plugins: [
    richI18n({ locales: i18nConfig.locales }),
    sveltekit()
  ]
};
```

### `src/app.html`

```html
<html lang="%lang%" dir="%dir%">
```

### `src/app.d.ts`

```ts
import type { Locale } from 'svelte-locale';

declare global {
  namespace App {
    interface Locals {
      locale: Locale;
    }
  }
}
export {};
```

### `src/hooks.server.ts`

```ts
import type { Handle } from '@sveltejs/kit';
import { handleI18n } from 'svelte-locale/server';

export const handle: Handle = handleI18n();
```

### `src/routes/+layout.server.ts`

```ts
export const load = ({ locals }) => ({ locale: locals.locale });
```

### `src/routes/+layout.svelte`

```svelte
<script lang="ts">
  import { initLocale } from 'svelte-locale';
  let { data, children } = $props();
  $effect(() => { initLocale(data.locale); });
</script>
{@render children()}
```

## Config (`src/lib/i18n/config.ts`)

```ts
export const i18nConfig = {
  locales: ['en', 'sv'] as const,
  defaultLocale: 'en',
  fallbackLocale: 'en',
  cookieName: 'locale',
  routing: {
    strategy: 'prefix-non-default', // 'prefix' | 'prefix-non-default' | 'none'
    prefixDefaultLocale: false
  },
  detection: ['url', 'cookie', 'accept-language', 'default'],
  rtl: ['ar', 'he', 'fa', 'ur']
} as const;
```

## Translation Files

### `messages.ts`

```ts
export const messages = {
  en: { 'common.save': 'Save', 'auth.welcome': 'Welcome, {name}' },
  sv: { 'common.save': 'Spara', 'auth.welcome': 'Välkommen, {name}' }
} as const;
```

### `plurals.ts`

```ts
export const plurals = {
  en: { 'tickets.count': { one: '{count} ticket', other: '{count} tickets' } },
  sv: { 'tickets.count': { one: '{count} ärende', other: '{count} ärenden' } }
} as const;
```

### `functions.ts`

```ts
export const functions = {
  en: {
    'billing.status': ({ status }) => status === 'paid' ? 'Paid' : 'Pending'
  },
  sv: {
    'billing.status': ({ status }) => status === 'paid' ? 'Betald' : 'Väntar'
  }
};
```

## Usage

```svelte
<script lang="ts">
  import { t, plural, fn, formatCurrency } from 'svelte-locale';
  import { I18n, LocaleLink, LocaleSwitcher } from 'svelte-locale/svelte';
</script>

<LocaleSwitcher />

<button>{t('common.save')}</button>

<p>{t('auth.welcome', { name: 'Vincent' })}</p>

<p>{plural('tickets.count', 5)}</p>

<p>{fn('billing.status', { status: 'paid' })}</p>

<p>{formatCurrency(299, 'SEK')}</p>

<I18n key="home.hero">
  <section lang="en"><h1>Support made simple</h1></section>
  <section lang="sv"><h1>Support gjort enkelt</h1></section>
</I18n>

<LocaleLink href="/settings">{t('settings.title')}</LocaleLink>
```

## `<I18n>` Rules

Every direct child must have a valid `lang` prop matching a configured locale. The Vite plugin transforms children into snippets at compile time so only the active locale is rendered server-side.

## Routing Strategies

| Strategy | `/en/settings` | `/sv/settings` | `/settings` |
|---|---|---|---|
| `prefix` | ✓ | ✓ | redirects to `/en/settings` |
| `prefix-non-default` | redirects to `/settings` | ✓ | ✓ (en) |
| `none` | — | — | ✓ |

## API Reference

### `svelte-locale`
- `t(key, values?)` — string translation
- `tForLocale(locale, key, values?)` — server-side string translation
- `plural(key, count, values?)` — plural translation
- `pluralForLocale(locale, key, count, values?)` — server-side plural
- `fn(key, ...args)` — function translation
- `fnForLocale(locale, key, ...args)` — server-side function
- `getLocale()` — current locale
- `setLocale(locale, { navigate? })` — change locale
- `initLocale(locale)` — initialize from server (use in root layout)
- `formatNumber(value, options?)`
- `formatCurrency(value, currency?, options?)`
- `formatDate(value, options?)`
- `formatRelativeTime(value, unit, options?)`
- `withLocale(path, locale?)` — prepend locale to path
- `switchLocaleInPath(path, locale)` — swap locale in path
- `getLocaleFromPath(pathname)` — extract locale from path

### `svelte-locale/server`
- `detectLocale(event)` — detect locale from request
- `handleI18n()` — SvelteKit `Handle` function

### `svelte-locale/svelte`
- `<I18n key fallback?>` — render active locale block
- `<LocaleLink href locale?>` — locale-prefixed anchor
- `<LocaleSwitcher />` — language switcher buttons

### `svelte-locale/vite`
- `richI18n({ locales? })` — Vite plugin for `<I18n>` transform

## Publishing

```bash
npm run prepack
npm publish
```
