// This file is a placeholder for user configuration
// Users will create their own src/lib/i18n.ts with defineConfig()
// 
// Example:
// import { defineConfig } from 'svelte-locale';
//
// export default defineConfig({
//   locales: ['en-US', 'sv-SE'],
//   defaultLocale: 'en-US',
//   fallbackLocale: 'en-US',
//   cookieName: 'locale',
//   routing: {
//     strategy: 'none',
//     prefixDefaultLocale: false
//   },
//   detection: ['url', 'cookie', 'accept-language', 'default']
// });

export { defineConfig } from './i18n/define-config.js';
export type { I18nConfig } from './i18n/config-types.js';
