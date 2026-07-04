export type RoutingStrategy = 'prefix' | 'prefix-non-default' | 'none';

export type DetectionMethod = 'url' | 'cookie' | 'accept-language' | 'default';

export interface I18nConfig {
	locales: readonly string[];
	defaultLocale: string;
	fallbackLocale: string;
	cookieName: string;
	routing: {
		strategy: RoutingStrategy;
		prefixDefaultLocale: boolean;
	};
	detection: readonly DetectionMethod[];
}

export interface I18nConfigInput {
	locales?: string[];
	defaultLocale?: string;
	fallbackLocale?: string;
	cookieName?: string;
	routing?: Partial<I18nConfig['routing']>;
	detection?: DetectionMethod[];
}
