import { i18nConfig, isLocale, type Locale } from './config.js';
import { getLocale } from './state.svelte.js';

export function getLocaleFromPath(pathname: string): Locale {
	const segments = pathname.split('/').filter(Boolean);
	const first = segments[0];
	if (first && isLocale(first)) return first;
	return i18nConfig.defaultLocale;
}

export function withLocale(path: string, locale?: Locale): string {
	const { strategy, prefixDefaultLocale } = i18nConfig.routing;
	const resolvedLocale = locale ?? getLocale();

	if (strategy === 'none') return path;

	const isDefault = resolvedLocale === i18nConfig.defaultLocale;
	if (strategy === 'prefix-non-default' && isDefault) return path;
	if (strategy === 'prefix' && !prefixDefaultLocale && isDefault) return path;

	const clean = stripLocalePrefix(path);
	return `/${resolvedLocale}${clean.startsWith('/') ? clean : `/${clean}`}`;
}

export function switchLocaleInPath(pathname: string, locale: Locale): string {
	const clean = stripLocalePrefix(pathname);
	return withLocale(clean, locale);
}

export function stripLocalePrefix(pathname: string): string {
	const segments = pathname.split('/').filter(Boolean);
	if (segments.length > 0 && isLocale(segments[0])) {
		return '/' + segments.slice(1).join('/');
	}
	return pathname.startsWith('/') ? pathname : `/${pathname}`;
}
