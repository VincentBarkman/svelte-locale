import { getLocaleDir } from './locales.js';
import type { I18nConfig } from './config-types.js';

export const i18nConfig: I18nConfig = {
	locales: ['en-US', 'sv-SE'],
	defaultLocale: 'en-US',
	fallbackLocale: 'en-US',
	cookieName: 'locale',
	routing: {
		strategy: 'none',
		prefixDefaultLocale: false
	},
	detection: ['url', 'cookie', 'accept-language', 'default']
};

export type Locale = string;

export function setConfig(config: I18nConfig): void {
	if (!config.locales || config.locales.length === 0) {
		throw new Error('[i18n] Config must include at least one locale in `locales` array.');
	}
	if (!config.defaultLocale || !config.locales.includes(config.defaultLocale)) {
		throw new Error('[i18n] `defaultLocale` must be included in `locales` array.');
	}
	if (!config.fallbackLocale || !config.locales.includes(config.fallbackLocale)) {
		throw new Error('[i18n] `fallbackLocale` must be included in `locales` array.');
	}
	const validStrategies = ['prefix', 'prefix-non-default', 'none'];
	if (!config.routing || !validStrategies.includes(config.routing.strategy)) {
		throw new Error(`[i18n] Invalid routing strategy: "${config.routing?.strategy}". Must be one of: ${validStrategies.join(', ')}.`);
	}
	Object.assign(i18nConfig, config);
}

export function isLocale(value: string): value is Locale {
	return i18nConfig.locales.includes(value);
}

export function getDirection(locale: string): 'ltr' | 'rtl' {
	return getLocaleDir(locale);
}
