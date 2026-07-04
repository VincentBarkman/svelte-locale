import { defineConfig } from '$lib/i18n/define-config';
import { setConfig } from '$lib/i18n/config';

const config = defineConfig({
	locales: ['en-US', 'sv-SE'],
	defaultLocale: 'en-US',
	fallbackLocale: 'en-US',
	cookieName: 'locale',
	routing: {
		strategy: 'none',
		prefixDefaultLocale: false
	},
	detection: ['url', 'cookie', 'accept-language', 'default']
});

setConfig(config);

export default config;
