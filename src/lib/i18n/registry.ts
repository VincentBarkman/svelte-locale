import type { Locale } from './config.js';

const DEV = import.meta.env.DEV;

export type PluralEntry = {
	one: string;
	other: string;
	zero?: string;
	two?: string;
	few?: string;
	many?: string;
};

export type MessageMap = Record<string, string>;
export type PluralMap = Record<string, PluralEntry>;
export type FunctionMap = Record<string, (...args: never[]) => unknown>;

const messageRegistry = new Map<Locale, MessageMap>();
const pluralRegistry = new Map<Locale, PluralMap>();
const functionRegistry = new Map<Locale, FunctionMap>();

export function defineMessages(data: Partial<Record<Locale, MessageMap>>): void {
	for (const [locale, map] of Object.entries(data) as [Locale, MessageMap][]) {
		const existing = messageRegistry.get(locale) ?? {};
		if (DEV) {
			for (const key of Object.keys(map)) {
				if (key in existing) console.warn(`[i18n] defineMessages: key "${key}" for locale "${locale}" is being overwritten.`);
			}
		}
		messageRegistry.set(locale, { ...existing, ...map });
	}
}

export function definePlurals(data: Partial<Record<Locale, PluralMap>>): void {
	for (const [locale, map] of Object.entries(data) as [Locale, PluralMap][]) {
		const existing = pluralRegistry.get(locale) ?? {};
		if (DEV) {
			for (const key of Object.keys(map)) {
				if (key in existing) console.warn(`[i18n] definePlurals: key "${key}" for locale "${locale}" is being overwritten.`);
			}
		}
		pluralRegistry.set(locale, { ...existing, ...map });
	}
}

export function defineFunctions(data: Partial<Record<Locale, FunctionMap>>): void {
	for (const [locale, map] of Object.entries(data) as [Locale, FunctionMap][]) {
		const existing = functionRegistry.get(locale) ?? {};
		if (DEV) {
			for (const key of Object.keys(map)) {
				if (key in existing) console.warn(`[i18n] defineFunctions: key "${key}" for locale "${locale}" is being overwritten.`);
			}
		}
		functionRegistry.set(locale, { ...existing, ...map });
	}
}

export function getMessage(locale: Locale, key: string): string | undefined {
	return messageRegistry.get(locale)?.[key];
}

export function getPlural(locale: Locale, key: string): PluralEntry | undefined {
	return pluralRegistry.get(locale)?.[key];
}

export function getFunction(locale: Locale, key: string): ((...args: never[]) => unknown) | undefined {
	return functionRegistry.get(locale)?.[key];
}
