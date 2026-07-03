import { getLocale } from './state.svelte.js';

const numberFormatCache = new Map<string, Intl.NumberFormat>();
const dateTimeFormatCache = new Map<string, Intl.DateTimeFormat>();
const relativeTimeFormatCache = new Map<string, Intl.RelativeTimeFormat>();

function cacheKey(locale: string, options?: object): string {
	return `${locale}::${options ? JSON.stringify(options) : ''}`;
}

function getNumberFormat(locale: string, options?: Intl.NumberFormatOptions): Intl.NumberFormat {
	const key = cacheKey(locale, options);
	if (!numberFormatCache.has(key)) numberFormatCache.set(key, new Intl.NumberFormat(locale, options));
	return numberFormatCache.get(key)!;
}

function getDateTimeFormat(locale: string, options?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
	const key = cacheKey(locale, options);
	if (!dateTimeFormatCache.has(key)) dateTimeFormatCache.set(key, new Intl.DateTimeFormat(locale, options));
	return dateTimeFormatCache.get(key)!;
}

function getRelativeTimeFormat(locale: string, options?: Intl.RelativeTimeFormatOptions): Intl.RelativeTimeFormat {
	const key = cacheKey(locale, options);
	if (!relativeTimeFormatCache.has(key)) relativeTimeFormatCache.set(key, new Intl.RelativeTimeFormat(locale, options));
	return relativeTimeFormatCache.get(key)!;
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
	return getNumberFormat(getLocale(), options).format(value);
}

export function formatCurrency(value: number, currency = 'USD', options?: Intl.NumberFormatOptions): string {
	return getNumberFormat(getLocale(), { style: 'currency', currency, ...options }).format(value);
}

export function formatDate(value: Date | string | number, options?: Intl.DateTimeFormatOptions): string {
	return getDateTimeFormat(getLocale(), options).format(new Date(value));
}

export function formatRelativeTime(
	value: number,
	unit: Intl.RelativeTimeFormatUnit,
	options?: Intl.RelativeTimeFormatOptions
): string {
	return getRelativeTimeFormat(getLocale(), { numeric: 'auto', ...options }).format(value, unit);
}

export function formatDateISO(value: Date | string | number): string {
	return new Date(value).toISOString().slice(0, 10);
}

export function formatDateTimeISO(value: Date | string | number): string {
	return new Date(value).toISOString();
}
