# svelte-locale

A SvelteKit-native i18n library for Svelte 5. Zero dependencies.

## Features

- `i18n.t()` — string translations with `{variable}` interpolation
- `i18n.plural()` — count-based pluralisation via `Intl.PluralRules`
- `i18n.fn()` — logic-based translations returning arbitrary values
- `<I18n>` — rich component translations with server-side rendering
- `<LocaleLink>` — locale-aware anchor tags
- `<LocaleSwitcher>` — accessible language switcher with custom snippet support
- `<HreflangLinks>` — SEO `<link rel="alternate">` tags
- Intl formatters for numbers, currencies, dates, and relative time
- ISO 8601 date formatters (`formatDateISO`, `formatDateTimeISO`)
- BCP 47 / ISO 639 regional locale support (`en-US`, `pt-BR`, `zh-CN`, etc.)
- Vite plugin that transforms `<I18n>` children into snippets at compile time
- Server locale detection: URL prefix → cookie → `Accept-Language` (full BCP 47) → default
- RTL support via `<html dir>` (auto-detected from locale registry)
- Zero flicker — locale is resolved server-side before any HTML is sent

## Installation

```bash
npx svelte-locale init
```

That's it. The `init` command installs the package and writes all required boilerplate into your project:

- `src/app.html` — patches `%lang%` and `%dir%` placeholders onto `<html>`
- `src/app.d.ts` — types `App.Locals.locale`
- `src/hooks.server.ts` — wires up `handleI18n()`
- `src/routes/+layout.server.ts` — passes locale to the client
- `src/routes/+layout.ts` — imports the i18n config
- `src/routes/+layout.svelte` — calls `i18n.initLocale` reactively
- `src/lib/i18n.ts` — configuration file with your locales
- `vite.config.ts` — patches in the `richI18n()` Vite plugin

Existing files are never overwritten — the command skips them and tells you.

Then edit `src/lib/i18n.ts` to configure your locales and create language data files.

---

## Manual Setup

If you prefer to wire things up yourself, first install the package:

```bash
npm install svelte-locale
```

Then create these files:

### `src/lib/i18n.ts`

```ts
import { defineConfig } from 'svelte-locale';

export default defineConfig({
  locales: ['en', 'sv'],
  defaultLocale: 'en',
  fallbackLocale: 'en',
  cookieName: 'locale',
  routing: {
    strategy: 'none',
    prefixDefaultLocale: false
  },
  detection: ['url', 'cookie', 'accept-language', 'default']
});
```

### `vite.config.ts`

Add `richI18n` **before** `sveltekit()`. The plugin auto-discovers your `i18n.ts` config.

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { richI18n } from 'svelte-locale/vite';

export default defineConfig({
  plugins: [
    richI18n(),
    sveltekit()
  ]
});
```

### `src/app.html`

```html
<html lang="%lang%" dir="%dir%">
```

### `src/app.d.ts`

```ts
declare global {
  namespace App {
    interface Locals {
      locale: import('svelte-locale').Locale;
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
export const load = ({ locals }: { locals: App.Locals }) => ({
  locale: locals.locale
});
```

### `src/routes/+layout.ts`

```ts
import '$lib/i18n';
```

### `src/routes/+layout.svelte`

```svelte
<script lang="ts">
  import { untrack } from 'svelte';
  import i18n from 'svelte-locale';
  import type { Snippet } from 'svelte';

  let { data, children }: { data: { locale: import('svelte-locale').Locale }; children: Snippet } = $props();

  untrack(() => i18n.initLocale(data.locale));

  $effect(() => {
    i18n.initLocale(data.locale);
  });
</script>

{@render children()}
```

### Defining Language Data

Create language data files anywhere in your project and register them via the `i18n` namespace:

```ts
// src/lib/i18n/messages.ts
import i18n from 'svelte-locale';

i18n.defineMessages({
  en: {
    'common.save': 'Save',
    'common.cancel': 'Cancel'
  },
  sv: {
    'common.save': 'Spara',
    'common.cancel': 'Avbryt'
  }
});
```

```ts
// src/lib/i18n/plurals.ts
import i18n from 'svelte-locale';

i18n.definePlurals({
  en: {
    'items.count': { one: '{count} item', other: '{count} items' }
  },
  sv: {
    'items.count': { one: '{count} sak', other: '{count} saker' }
  }
});
```

```ts
// src/lib/i18n/functions.ts
import i18n from 'svelte-locale';

i18n.defineFunctions({
  en: {
    'format.currency': (amount: number) => `$${amount.toFixed(2)}`
  },
  sv: {
    'format.currency': (amount: number) => `${amount.toFixed(2)} kr`
  }
});
```

Note: `defineMessages`, `definePlurals`, and `defineFunctions` can be called anywhere and as many times as you want — they merge into the registry.

---

The library ships with a default `config.ts` baked into the library itself. To customise it, fork the library or create your own config file. The current defaults are:

```ts
export const i18nConfig = {
  locales: ['en', 'sv'] as const,
  defaultLocale: 'en',
  fallbackLocale: 'en',
  cookieName: 'locale',
  routing: {
    strategy: 'none', // 'prefix' | 'prefix-non-default' | 'none'
    prefixDefaultLocale: false
  },
  detection: ['url', 'cookie', 'accept-language', 'default']
} as const;
```

**`locales`** — all supported locale codes.

**`defaultLocale`** — used when no locale can be detected.

**`fallbackLocale`** — used when a translation key is missing for the active locale.

**`cookieName`** — the cookie used to persist locale preference across requests.

**`routing.strategy`**
- `'none'` — no URL prefix, locale is cookie/header only.
- `'prefix-non-default'` — non-default locales get a prefix (e.g. `/sv/settings`), default locale uses clean paths.
- `'prefix'` — all locales get a prefix including the default.

**`detection`** — order of locale detection sources. `'url'` checks the path prefix; `'cookie'` reads the cookie; `'accept-language'` parses the request header; `'default'` falls back to `defaultLocale`.

---

## Translation Files

Create these anywhere in your project (e.g. `src/lib/i18n/`). They register data into the shared runtime registry via side-effects.

### Messages — `t()`

```ts
import { defineMessages } from 'svelte-locale';

defineMessages({
  en: {
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'auth.welcome': 'Welcome back, {name}'
  },
  sv: {
    'common.save': 'Spara',
    'common.cancel': 'Avbryt',
    'auth.welcome': 'Välkommen tillbaka, {name}'
  }
});
```

Use `{variableName}` syntax for interpolation. Missing variables produce a warning in dev and are left as-is in the output.

### Plurals — `plural()`

```ts
import { definePlurals } from 'svelte-locale';

definePlurals({
  en: {
    'tickets.count': {
      one: '{count} ticket',
      other: '{count} tickets'
    }
  },
  sv: {
    'tickets.count': {
      one: '{count} ärende',
      other: '{count} ärenden'
    }
  }
});
```

Each entry can have keys: `one`, `other`, `zero`, `two`, `few`, `many`. Which categories apply depends on the locale — they match the categories returned by `Intl.PluralRules`. `other` is always required as a fallback.

### Functions — `fn()`

For translations that require logic — formatting, conditionals, composing strings from data.

```ts
import { defineFunctions, createFn } from 'svelte-locale';

export type AppFunctions = {
  'billing.status': (input: { status: 'paid' | 'pending' | 'overdue'; days?: number }) => string;
  'audit.event': (input: { actor: string; action: string; target: string }) => string;
};

defineFunctions({
  en: {
    'billing.status': ({ status, days }) => {
      if (status === 'paid') return 'Invoice is paid.';
      if (status === 'overdue') return `Invoice is overdue by ${days ?? 0} days.`;
      return 'Invoice is pending.';
    },
    'audit.event': ({ actor, action, target }) => `${actor} ${action} ${target}.`
  },
  sv: {
    'billing.status': ({ status, days }) => {
      if (status === 'paid') return 'Fakturan är betald.';
      if (status === 'overdue') return `Fakturan är ${days ?? 0} dagar sen.`;
      return 'Fakturan väntar på betalning.';
    },
    'audit.event': ({ actor, action, target }) => `${actor} ${action} ${target}.`
  }
});

// Export a typed fn() bound to your function map
export const fn = createFn<AppFunctions>();
```

Import and use `fn` from your own file — not from `svelte-locale` directly — to get full type inference on keys and arguments.

---

## API

### `t(key, values?)`

Translate a string key for the current locale. Falls back to `fallbackLocale` if missing, then returns the key itself.

```ts
import { t } from 'svelte-locale';

t('common.save')                         // → 'Save'
t('auth.welcome', { name: 'Vincent' })   // → 'Welcome back, Vincent'
```

### `tForLocale(locale, key, values?)`

Same as `t()` but for a specific locale. Useful in server-side `load` functions.

```ts
import { tForLocale } from 'svelte-locale';

tForLocale('sv', 'common.save') // → 'Spara'
```

### `plural(key, count, values?)`

Resolve a plural string using `Intl.PluralRules` for the current locale. `{count}` is automatically available as an interpolation variable.

```ts
import { plural } from 'svelte-locale';

plural('tickets.count', 1)  // → '1 ticket'
plural('tickets.count', 5)  // → '5 tickets'
```

### `pluralForLocale(locale, key, count, values?)`

Same as `plural()` but for a specific locale.

### `fn(key, input)` / `createFn<M>()`

`fn` from `svelte-locale` is untyped. Use `createFn<YourFunctionMap>()` to get a typed version bound to your own function definitions.

```ts
// src/lib/i18n/functions.ts
export const fn = createFn<AppFunctions>();

// In a component
import { fn } from '$lib/i18n/functions';
fn('billing.status', { status: 'overdue', days: 3 }) // fully typed
```

### `fnForLocale(locale, key, ...args)`

Untyped fn call for a specific locale. Useful server-side.

### `getLocale()`

Returns the currently active locale as a reactive value (Svelte 5 `$state` under the hood). Safe to call in `$derived` and templates.

```ts
import { getLocale } from 'svelte-locale';

const locale = getLocale(); // 'en' | 'sv'
```

### `setLocale(locale, options?)`

Change the active locale at runtime.

- Updates the reactive locale state
- Sets `document.documentElement.lang` and `dir`
- Writes the locale cookie (1 year, `SameSite=Lax`)
- If `navigate: true` and routing strategy is `'none'`, calls `invalidateAll()` to re-run load functions
- If `navigate: true` and a prefix strategy is used, calls `goto()` with the locale-swapped path (`noScroll`, `keepFocus`)

```ts
import { setLocale } from 'svelte-locale';

setLocale('sv', { navigate: true });
```

### `initLocale(locale)`

Set the locale from a server-resolved value. Call this in your root layout from `$effect`. No navigation side-effects.

### `defineLocale(code, definition)`

Register a custom locale not in the built-in registry, or override an existing entry.

```ts
import { defineLocale } from 'svelte-locale';

defineLocale('tok', { name: 'Toki Pona', dir: 'ltr' });
```

### `getLocaleName(locale)`

Get the human-readable name of a locale from the built-in registry.

```ts
getLocaleName('sv') // → 'Svenska'
getLocaleName('ar') // → 'العربية'
```

### `getLocaleDir(locale)`

Get the text direction for a locale. Returns `'ltr'` or `'rtl'`.

```ts
getLocaleDir('ar') // → 'rtl'
getLocaleDir('en') // → 'ltr'
```

### `getLocaleRegistry()`

Returns a read-only snapshot of the full locale registry (all built-in + custom locales).

```ts
import { getLocaleRegistry } from 'svelte-locale';

const registry = getLocaleRegistry();
// { en: { name: 'English', dir: 'ltr' }, sv: { name: 'Svenska', dir: 'ltr' }, ... }
```

---

## Intl Formatters

All formatters read the current locale automatically. Formatters are cached per locale+options combination.

### `formatNumber(value, options?)`

```ts
import { formatNumber } from 'svelte-locale';

formatNumber(1234567.89)                        // → '1,234,567.89' (en)
formatNumber(0.42, { style: 'percent' })        // → '42%'
```

### `formatCurrency(value, currency?, options?)`

```ts
import { formatCurrency } from 'svelte-locale';

formatCurrency(299, 'SEK')   // → 'SEK 299.00' (en) / '299,00 kr' (sv)
formatCurrency(9.99, 'USD')  // → '$9.99'
```

### `formatDate(value, options?)`

Accepts a `Date`, ISO string, or timestamp.

```ts
import { formatDate } from 'svelte-locale';

formatDate(new Date(), { dateStyle: 'long' })   // → 'July 3, 2026' (en)
formatDate('2026-01-01', { month: 'short', year: 'numeric' })
```

### `formatRelativeTime(value, unit, options?)`

```ts
import { formatRelativeTime } from 'svelte-locale';

formatRelativeTime(-2, 'day')   // → '2 days ago' (en)
formatRelativeTime(1, 'hour')   // → 'in 1 hour'
```

### `formatDateISO(value)`

Returns a date-only [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) string. Locale-independent.

```ts
import { formatDateISO } from 'svelte-locale';

formatDateISO(new Date())          // → '2026-07-03'
formatDateISO('2026-01-15T10:30Z') // → '2026-01-15'
```

### `formatDateTimeISO(value)`

Returns a full UTC ISO 8601 timestamp. Useful for `<time datetime>` attributes.

```ts
import { formatDateTimeISO } from 'svelte-locale';

formatDateTimeISO(new Date()) // → '2026-07-03T10:00:00.000Z'
```

---

## Routing Helpers

### `withLocale(path, locale?)`

Prepend the locale prefix to a path based on the configured routing strategy. If `locale` is omitted, uses the current active locale.

```ts
import { withLocale } from 'svelte-locale';

// strategy: 'prefix-non-default', default: 'en'
withLocale('/settings')        // → '/settings' (en, no prefix)
withLocale('/settings', 'sv')  // → '/sv/settings'
```

### `switchLocaleInPath(pathname, locale)`

Swap the locale prefix in a path.

```ts
switchLocaleInPath('/sv/settings', 'en') // → '/settings'
switchLocaleInPath('/settings', 'sv')    // → '/sv/settings'
```

### `getLocaleFromPath(pathname)`

Extract the locale from the first path segment. Returns `defaultLocale` if no locale prefix is found.

```ts
getLocaleFromPath('/sv/settings') // → 'sv'
getLocipeFromPath('/settings')    // → 'en'
```

### `stripLocalePrefix(pathname)`

Remove the locale prefix from a path.

```ts
stripLocalePrefix('/sv/settings') // → '/settings'
```

---

## ISO & BCP 47 Locale Support

### Regional locale codes

The library supports full [BCP 47](https://www.rfc-editor.org/rfc/rfc5646) locale tags. Use them anywhere you use short codes:

```ts
// vite.config.ts
richI18n({ locales: ['en-US', 'en-GB', 'pt-BR', 'zh-CN', 'zh-TW'] })
```

```ts
// src/lib/i18n/messages.ts
defineMessages({
  'en-US': { 'currency.symbol': '$' },
  'en-GB': { 'currency.symbol': '£' },
  'pt-BR': { 'greeting': 'Olá' }
});
```

The registry ships with entries for all common regional variants. For any unregistered subtag the library automatically falls back to the base language for RTL detection — so `ar-DZ` correctly resolves as `rtl` via the `ar` base entry.

### Built-in regional variants

| Tag | Name |
|-----|------|
| `en-US` | English (US) |
| `en-GB` | English (UK) |
| `en-AU` | English (Australia) |
| `en-CA` | English (Canada) |
| `fr-FR` / `fr-CA` / `fr-BE` / `fr-CH` | French variants |
| `de-DE` / `de-AT` / `de-CH` | German variants |
| `es-ES` / `es-MX` / `es-AR` / `es-CO` | Spanish variants |
| `pt-PT` / `pt-BR` | Portuguese variants |
| `zh-CN` / `zh-TW` / `zh-HK` | Chinese variants |
| `ar-SA` / `ar-EG` | Arabic variants (RTL) |
| `nl-NL` / `nl-BE` | Dutch variants |
| `it-IT` / `it-CH` | Italian variants |
| `sv-SE` / `nb-NO` / `nn-NO` / `fi-FI` / `da-DK` | Nordic |
| `ru-RU` / `uk-UA` / `pl-PL` | Eastern European |
| `ja-JP` / `ko-KR` / `hi-IN` | Asian |

Add any extra variant with `defineLocale`:

```ts
import { defineLocale } from 'svelte-locale';
defineLocale('es-CL', { name: 'Español (Chile)', dir: 'ltr' });
```

### Locale utilities

```ts
import { getBaseLocale, normalizeLocale, getLocaleDir, getLocaleName } from 'svelte-locale';

getBaseLocale('en-US')      // → 'en'
normalizeLocale('pt-br')    // → 'pt-BR'
getLocaleDir('ar-SA')       // → 'rtl'
getLocaleDir('ar-DZ')       // → 'rtl'  (falls back to 'ar')
getLocaleName('pt-BR')      // → 'Português (Brasil)'
```

### `Accept-Language` detection

The server-side locale detector now matches full BCP 47 tags before falling back to the base language:

- `Accept-Language: pt-BR, pt;q=0.9, en;q=0.8` → resolves to `pt-BR` if configured, then `pt`, then `en`
- Works automatically — no extra configuration needed.

---

## Components

### `<I18n>`

Renders only the content block matching the active locale. All other locale blocks are stripped at compile time by the Vite plugin — only one snippet ever hits the DOM.

```svelte
<I18n key="home.hero">
  <div lang="en">
    <h1>Support made simple</h1>
  </div>
  <div lang="sv">
    <h1>Support gjort enkelt</h1>
  </div>
</I18n>
```

**Props:**
- `key` — identifier used in dev warnings (does not look up registry)
- `fallback?` — locale to render if the active locale block is missing (defaults to `fallbackLocale`)
- `as?` — wrap the output in an HTML element (`'section'`, `'div'`, etc.)
- `class?` / `style?` — passed to the wrapper element (requires `as`)

Each direct child **must** have a `lang` attribute matching a configured locale. Any valid Svelte content is allowed inside — components, `{#if}`, `{#each}`, slots, etc.

The Vite plugin (`richI18n`) transforms the children into proper Svelte snippets at compile time. Missing or duplicate `lang` values produce warnings during development.

### `<LocaleSwitcher>`

Renders a button per configured locale. The active locale button has `aria-pressed="true"`. Clicking switches the locale and navigates if needed.

```svelte
<LocaleSwitcher />
```

**Default styling props:**
- `class?` / `style?` — applied to the wrapping `<div role="group">`
- `buttonClass?` / `buttonStyle?` — applied to each default button

**Custom button via snippet:**

Replace the default button entirely. The snippet receives `{ locale, active, label, select }`.

```svelte
<LocaleSwitcher>
  {#snippet button({ locale, active, label, select })}
    <button
      onclick={select}
      aria-pressed={active}
      style="font-weight: {active ? 'bold' : 'normal'}"
    >
      {locale.toUpperCase()} — {label}
    </button>
  {/snippet}
</LocaleSwitcher>
```

### `<LocaleLink>`

A locale-aware anchor. Automatically prepends the correct locale prefix based on the routing strategy. Accepts all standard `<a>` attributes.

```svelte
<LocaleLink href="/settings">Settings</LocaleLink>

<!-- Force a specific locale -->
<LocaleLink href="/settings" locale="sv">Svenska inställningar</LocaleLink>
```

### `<HreflangLinks>`

Injects `<link rel="alternate" hreflang="...">` tags into `<head>` for SEO. Place it in your root layout.

```svelte
<script lang="ts">
  import { page } from '$app/stores';
  import { HreflangLinks } from 'svelte-locale/svelte';
</script>

<HreflangLinks pathname={$page.url.pathname} origin={$page.url.origin} />
```

**Props:**
- `pathname` — current page path (required)
- `origin?` — base URL for absolute hrefs (e.g. `https://example.com`)
- `xDefault?` — include `hreflang="x-default"` pointing to the default locale (default: `true`)
- `extraLocales?` — additional `{ hreflang, locale }` entries for region variants (e.g. `en-GB`)

---

## Server API

### `handleI18n()`

Returns a SvelteKit `Handle` function. Does the following on every request:

1. Detects locale (URL → cookie → `Accept-Language` → default)
2. Sets `event.locals.locale`
3. Handles routing redirects for prefix strategies
4. Writes the locale cookie (1 year)
5. Replaces `%lang%` and `%dir%` in the HTML via `transformPageChunk`
6. Sets `Content-Language` response header

```ts
import { handleI18n } from 'svelte-locale/server';

export const handle: Handle = handleI18n();
```

### `detectLocale(event)`

Runs just the detection logic without the full handle middleware. Useful if you need to compose `handle` manually.

```ts
import { detectLocale } from 'svelte-locale/server';

const locale = detectLocale(event); // 'en' | 'sv' | ...
```

---

## Routing Strategies

| Strategy | `/settings` | `/sv/settings` | `/en/settings` |
|---|---|---|---|
| `none` | ✓ (en) | — | — |
| `prefix-non-default` | ✓ (en) | ✓ (sv) | redirects → `/settings` |
| `prefix` | redirects → `/en/settings` | ✓ (sv) | ✓ (en) |

---

## Built-in Locale Registry

The library includes display names and text directions for 80+ languages out of the box (`af`, `ar`, `bg`, `cs`, `da`, `de`, `el`, `en`, `es`, `et`, `fa`, `fi`, `fr`, `he`, `hi`, `hr`, `hu`, `id`, `it`, `ja`, `ko`, `lt`, `lv`, `mk`, `ms`, `nl`, `nb`, `nn`, `pl`, `pt`, `ro`, `ru`, `sk`, `sl`, `sq`, `sr`, `sv`, `th`, `tr`, `uk`, `ur`, `vi`, `zh`, and more).

RTL locales include `ar`, `he`, `fa`, `ku`, `ur`, `yi`.

Use `defineLocale()` to add or override any entry.

---

## Vite Plugin

`richI18n({ locales? })` — processes `.svelte` files at compile time.

- Finds `<I18n>` components and transforms their `lang`-attributed children into Svelte `{#snippet}` blocks
- Generates proper source maps so stack traces point to the original source
- In development, warns about: invalid `lang` values, duplicate `lang` values, and missing locale blocks
- `locales` — array of valid locale codes for validation (should match your `i18nConfig.locales`)

---

## Publishing a New Version

```bash
# Build and validate
npm run prepack

# Bump version (patch / minor / major), auto-commits + tags
npm version patch

# Push commits and tag
git push && git push --tags

# Publish to npm
npm publish --access public
```
