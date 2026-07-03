export { t, tForLocale } from './t.js';
export { plural, pluralForLocale } from './plural.js';
export type { PluralEntry } from './registry.js';
export { fn, fnForLocale, createFn } from './fn.js';
export { defineMessages, definePlurals, defineFunctions } from './registry.js';

export { i18n, initLocale, getLocale, setLocale } from './state.svelte.js';

export { formatNumber, formatCurrency, formatDate, formatRelativeTime, formatDateISO, formatDateTimeISO } from './format.js';

export { withLocale, switchLocaleInPath, getLocaleFromPath, stripLocalePrefix } from './route.js';

export type { Locale } from './config.js';
export type { InterpolationValues } from './utils.js';
export { defineLocale, getLocaleName, getLocaleDir, getLocaleRegistry, getBaseLocale, normalizeLocale } from './locales.js';
export type { LocaleDefinition } from './locales.js';
