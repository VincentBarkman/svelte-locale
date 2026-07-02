import { DEV } from 'esm-env';
import { i18nConfig, type Locale } from './config.js';
import { getMessage } from './registry.js';
import { getLocale } from './state.svelte.js';
import { interpolate, type InterpolationValues } from './utils.js';

export function tForLocale(
	locale: Locale,
	key: string,
	values?: InterpolationValues
): string {
	let message = getMessage(locale, key);

	if (message === undefined && locale !== i18nConfig.fallbackLocale) {
		message = getMessage(i18nConfig.fallbackLocale, key);
		if (DEV && message !== undefined) {
			console.warn(`[i18n] Missing translation key "${key}" for locale "${locale}", using fallback.`);
		}
	}

	if (message === undefined) {
		if (DEV) {
			console.warn(`[i18n] Missing translation key "${key}"`);
		}
		return key;
	}

	return interpolate(message, values);
}

export function t(key: string, values?: InterpolationValues): string {
	return tForLocale(getLocale(), key, values);
}
