import { DEV } from 'esm-env';
import { i18nConfig, type Locale } from './config.js';
import { getFunction } from './registry.js';
import { getLocale } from './state.svelte.js';

export function fnForLocale(
	locale: Locale,
	key: string,
	...args: unknown[]
): unknown {
	let fn = getFunction(locale, key);

	if (!fn && locale !== i18nConfig.fallbackLocale) {
		fn = getFunction(i18nConfig.fallbackLocale, key);
		if (DEV && fn) {
			console.warn(`[i18n] Missing function "${key}" for locale "${locale}", using fallback.`);
		}
	}

	if (!fn) {
		if (DEV) {
			console.warn(`[i18n] Missing function "${key}"`);
		}
		return key;
	}

	return fn(...(args as never[]));
}

export function fn(
	key: string,
	...args: unknown[]
): unknown {
	return fnForLocale(getLocale(), key, ...args);
}

type AnyFnMap = Record<string, (...args: never[]) => unknown>;
type FnInput<M extends AnyFnMap, K extends keyof M> = Parameters<M[K]> extends [] ? [] : [Parameters<M[K]>[0]];
type FnOutput<M extends AnyFnMap, K extends keyof M> = ReturnType<M[K]>;

export function createFn<M extends AnyFnMap>() {
	return function typedFn<K extends string & keyof M>(
		key: K,
		...args: FnInput<M, K>
	): FnOutput<M, K> {
		return fnForLocale(getLocale(), key, ...args) as FnOutput<M, K>;
	};
}
