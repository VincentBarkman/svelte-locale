import { getLocaleDir } from './locales.js';
import type { I18nConfig } from './config-types.js';

// Library's default config - user projects will override this with their own i18n.ts
export const i18nConfig: I18nConfig = {
	locales: ['en'],
	defaultLocale: 'en',
	fallbackLocale: 'en',
	cookieName: 'locale',
	routing: {
		strategy: 'none',
		prefixDefaultLocale: false
	},
	detection: ['url', 'cookie', 'accept-language', 'default']
};

export type Locale = string;

export function isLocale(value: string): value is Locale {
	return i18nConfig.locales.includes(value);
}

export function getDirection(locale: string): 'ltr' | 'rtl' {
	return getLocaleDir(locale);
}
