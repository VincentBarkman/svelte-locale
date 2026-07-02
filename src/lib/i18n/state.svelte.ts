import { browser } from '$app/environment';
import { goto, invalidateAll } from '$app/navigation';
import { page } from '$app/stores';
import { get } from 'svelte/store';
import { i18nConfig, isLocale, getDirection, type Locale } from './config.js';
import { switchLocaleInPath } from './route.js';

let _locale = $state<Locale>(i18nConfig.defaultLocale);

export const i18n = {
	get locale() {
		return _locale;
	}
};

export function getLocale(): Locale {
	return _locale;
}

export function initLocale(locale: Locale): void {
	_locale = locale;
}

export interface SetLocaleOptions {
	navigate?: boolean;
}

export function setLocale(locale: Locale, options: SetLocaleOptions = {}): void {
	if (!isLocale(locale)) {
		console.warn(`[i18n] Invalid locale "${locale}".`);
		return;
	}

	_locale = locale;

	if (browser) {
		document.documentElement.lang = locale;
		document.documentElement.dir = getDirection(locale);

		document.cookie = `${i18nConfig.cookieName}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
	}

	if (options.navigate && browser) {
		if (i18nConfig.routing.strategy === 'none') {
			invalidateAll();
		} else {
			const newPath = switchLocaleInPath(get(page).url.pathname, locale);
			goto(newPath, { noScroll: true, keepFocus: true, invalidateAll: true });
		}
	}
}
