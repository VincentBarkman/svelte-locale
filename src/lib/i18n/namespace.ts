import { t, tForLocale } from './t.js';
import { plural, pluralForLocale } from './plural.js';
import { fn, fnForLocale, createFn } from './fn.js';
import { defineMessages, definePlurals, defineFunctions } from './registry.js';
import { initLocale, getLocale, setLocale, type SetLocaleOptions } from './state.svelte.js';
import { formatNumber, formatCurrency, formatDate, formatDateForLocale, formatRelativeTime, formatDateISO, formatDateTimeISO } from './format.js';
import { withLocale, switchLocaleInPath, getLocaleFromPath, stripLocalePrefix } from './route.js';
import { defineLocale, getLocaleName, getLocaleDir, getLocaleRegistry, getBaseLocale, normalizeLocale } from './locales.js';

/**
 * The i18n namespace object containing all internationalization functions.
 * Import as: `import i18n from 'svelte-locale'`
 */
const i18nNamespace = {
	// Translations
	/** Translate a string key for the current locale */
	t,
	/** Translate a string key for a specific locale */
	tForLocale,
	/** Get pluralized string for the current locale */
	plural,
	/** Get pluralized string for a specific locale */
	pluralForLocale,
	/** Call a locale-specific function for the current locale */
	fn,
	/** Call a locale-specific function for a specific locale */
	fnForLocale,
	/** Create a typed function caller */
	createFn,

	// Registry
	/** Register message translations */
	defineMessages,
	/** Register plural rules */
	definePlurals,
	/** Register locale-specific functions */
	defineFunctions,

	// State
	/** Current locale (reactive) */
	get locale() {
		return getLocale();
	},
	/** Initialize locale on client */
	initLocale,
	/** Get current locale */
	getLocale,
	/** Set current locale */
	setLocale,

	// Formatters
	/** Format a number for the current locale */
	formatNumber,
	/** Format currency for the current locale */
	formatCurrency,
	/** Format a date for the current locale */
	formatDate,
	/** Format a date for a specific locale */
	formatDateForLocale,
	/** Format relative time for the current locale */
	formatRelativeTime,
	/** Format date as ISO 8601 string */
	formatDateISO,
	/** Format datetime as ISO 8601 string */
	formatDateTimeISO,

	// Routing
	/** Run callback with temporary locale override */
	withLocale,
	/** Switch locale in URL path */
	switchLocaleInPath,
	/** Extract locale from URL path */
	getLocaleFromPath,
	/** Remove locale prefix from path */
	stripLocalePrefix,

	// Locale helpers
	/** Register a custom locale definition */
	defineLocale,
	/** Get localized name for a locale */
	getLocaleName,
	/** Get text direction for a locale */
	getLocaleDir,
	/** Get locale registry entry */
	getLocaleRegistry,
	/** Get base locale from regional variant */
	getBaseLocale,
	/** Normalize locale code */
	normalizeLocale
};

export type { SetLocaleOptions } from './state.svelte.js';

export default i18nNamespace;
