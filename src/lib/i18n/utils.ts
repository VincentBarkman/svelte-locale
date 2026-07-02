import { DEV } from 'esm-env';

export type InterpolationValues = Record<string, string | number>;

export function interpolate(template: string, values?: InterpolationValues): string {
	if (!values) return template;
	return template.replace(/\{(\w+)\}/g, (_, key) => {
		if (key in values) return String(values[key]);
		if (DEV) {
			console.warn(`[i18n] Missing interpolation variable "{${key}}" in template: "${template}"`);
		}
		return `{${key}}`;
	});
}
