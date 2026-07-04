import { t, tForLocale } from './t.js';
import { plural, pluralForLocale } from './plural.js';
import { fn, fnForLocale, createFn } from './fn.js';
import { defineMessages, definePlurals, defineFunctions } from './registry.js';
import { i18n as i18nState, initLocale, getLocale, setLocale, type SetLocaleOptions } from './state.svelte.js';
import { formatNumber, formatCurrency, formatDate, formatRelativeTime, formatDateISO, formatDateTimeISO } from './format.js';
import { withLocale, switchLocaleInPath, getLocaleFromPath, stripLocalePrefix } from './route.js';
import { defineLocale, getLocaleName, getLocaleDir, getLocaleRegistry, getBaseLocale, normalizeLocale } from './locales.js';

const i18nNamespace = {
	// Translations
	t,
	tForLocale,
	plural,
	pluralForLocale,
	fn,
	fnForLocale,
	createFn,

	// Registry
	defineMessages,
	definePlurals,
	defineFunctions,

	// State
	locale: i18nState.locale,
	initLocale,
	getLocale,
	setLocale,

	// Formatters
	formatNumber,
	formatCurrency,
	formatDate,
	formatRelativeTime,
	formatDateISO,
	formatDateTimeISO,

	// Routing
	withLocale,
	switchLocaleInPath,
	getLocaleFromPath,
	stripLocalePrefix,

	// Locale helpers
	defineLocale,
	getLocaleName,
	getLocaleDir,
	getLocaleRegistry,
	getBaseLocale,
	normalizeLocale
};

export type { SetLocaleOptions } from './state.svelte.js';

export default i18nNamespace;
