import { getLocaleDir } from './locales.js';

export const i18nConfig = {
	locales: ['en', 'sv'] as const,
	defaultLocale: 'en' as const,
	fallbackLocale: 'en' as const,
	cookieName: 'locale',

	routing: {
		strategy: 'none' as 'prefix' | 'prefix-non-default' | 'none',
		prefixDefaultLocale: false
	},

	detection: ['url', 'cookie', 'accept-language', 'default'] as const
} as const;

export type Locale = (typeof i18nConfig.locales)[number];

export function isLocale(value: string): value is Locale {
	return (i18nConfig.locales as readonly string[]).includes(value);
}

export function getDirection(locale: string): 'ltr' | 'rtl' {
	return getLocaleDir(locale);
}
