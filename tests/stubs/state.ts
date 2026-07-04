// Stub for state.svelte.ts to avoid Svelte runes in tests
let _locale = 'en-US';

export function initLocale(locale: string): void {
	_locale = locale;
}

export function getLocale(): string {
	return _locale;
}

export function setLocale(locale: string): void {
	_locale = locale;
}

export const i18n = {
	locale: _locale,
	initLocale,
	getLocale,
	setLocale
};
