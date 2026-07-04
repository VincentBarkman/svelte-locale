import type { I18nConfig, I18nConfigInput } from './config-types.js';

export function defineConfig(input: I18nConfigInput = {}): I18nConfig {
	return {
		locales: input.locales ?? ['en'],
		defaultLocale: input.defaultLocale ?? 'en',
		fallbackLocale: input.fallbackLocale ?? 'en',
		cookieName: input.cookieName ?? 'locale',
		routing: {
			strategy: input.routing?.strategy ?? 'none',
			prefixDefaultLocale: input.routing?.prefixDefaultLocale ?? false
		},
		detection: input.detection ?? ['url', 'cookie', 'accept-language', 'default']
	};
}
