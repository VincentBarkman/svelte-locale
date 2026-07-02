import { DEV } from 'esm-env';
import { i18nConfig, type Locale } from './config.js';
import { getPlural, type PluralEntry } from './registry.js';
import { getLocale } from './state.svelte.js';
import { interpolate, type InterpolationValues } from './utils.js';


const pluralRulesCache = new Map<string, Intl.PluralRules>();

function getPluralRules(locale: Locale): Intl.PluralRules {
	if (!pluralRulesCache.has(locale)) {
		pluralRulesCache.set(locale, new Intl.PluralRules(locale));
	}
	return pluralRulesCache.get(locale)!;
}

export function pluralForLocale(
	locale: Locale,
	key: string,
	count: number,
	values?: InterpolationValues
): string {
	let entry = getPlural(locale, key);

	if (!entry && locale !== i18nConfig.fallbackLocale) {
		entry = getPlural(i18nConfig.fallbackLocale, key);
		if (DEV && entry) {
			console.warn(`[i18n] Missing plural key "${key}" for locale "${locale}", using fallback.`);
		}
	}

	if (!entry) {
		if (DEV) {
			console.warn(`[i18n] Missing plural key "${key}"`);
		}
		return key;
	}

	const category = getPluralRules(locale).select(count) as keyof PluralEntry;
	const template = entry[category] ?? entry.other;
	if (DEV && !entry[category] && category !== 'other') {
		console.warn(`[i18n] Plural key "${key}" is missing category "${String(category)}" for locale "${locale}", falling back to "other".`);
	}

	return interpolate(template, { count, ...values });
}

export function plural(
	key: string,
	count: number,
	values?: InterpolationValues
): string {
	return pluralForLocale(getLocale(), key, count, values);
}
