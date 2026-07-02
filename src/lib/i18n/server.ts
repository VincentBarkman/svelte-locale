import type { Handle, RequestEvent } from '@sveltejs/kit';
import { i18nConfig, isLocale, getDirection, type Locale } from './config.js';
import { withLocale, getLocaleFromPath } from './route.js';

export function detectLocale(event: RequestEvent): Locale {
	const { strategy } = i18nConfig.routing;

	if (strategy !== 'none') {
		const fromUrl = getLocaleFromPath(event.url.pathname);
		if (isLocale(fromUrl) && fromUrl !== i18nConfig.defaultLocale) {
			return fromUrl;
		}
		if (strategy === 'prefix' && i18nConfig.routing.prefixDefaultLocale) {
			const segments = event.url.pathname.split('/').filter(Boolean);
			if (segments.length > 0 && isLocale(segments[0])) {
				return segments[0] as Locale;
			}
		}
	}

	const cookieLocale = event.cookies.get(i18nConfig.cookieName);
	if (cookieLocale && isLocale(cookieLocale)) {
		return cookieLocale;
	}

	const acceptLanguage = event.request.headers.get('accept-language');
	if (acceptLanguage) {
		const tags = acceptLanguage
			.split(',')
			.map((s) => s.split(';')[0].trim().toLowerCase().slice(0, 2));
		for (const tag of tags) {
			if (isLocale(tag)) return tag;
		}
	}

	return i18nConfig.defaultLocale;
}

export function handleI18n(): Handle {
	return async ({ event, resolve }) => {
		const locale = detectLocale(event);
		(event.locals as App.Locals).locale = locale;

		const { strategy, prefixDefaultLocale } = i18nConfig.routing;
		const isDefault = locale === i18nConfig.defaultLocale;

		if (strategy !== 'none') {
			const pathname = event.url.pathname;
			const segments = pathname.split('/').filter(Boolean);
			const firstSegment = segments[0];
			const hasPrefix = firstSegment && isLocale(firstSegment);

			if (strategy === 'prefix' && prefixDefaultLocale && !hasPrefix) {
				const newPath = withLocale(pathname, locale);
				return new Response(null, {
					status: 302,
					headers: { Location: newPath + (event.url.search || '') }
				});
			}

			if (strategy === 'prefix-non-default' && isDefault && hasPrefix) {
				const clean = '/' + segments.slice(1).join('/');
				return new Response(null, {
					status: 302,
					headers: { Location: clean + (event.url.search || '') }
				});
			}
		}

		const dir = getDirection(locale);

		event.cookies.set(i18nConfig.cookieName, locale, {
			path: '/',
			maxAge: 31536000,
			sameSite: 'lax',
			httpOnly: false
		});

		const response = await resolve(event, {
			transformPageChunk({ html }) {
				return html.replace('%lang%', locale).replace('%dir%', dir);
			}
		});

		response.headers.set('Content-Language', locale);
		return response;
	};
}
