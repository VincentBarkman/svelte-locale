const DEV = import.meta.env.DEV;

export type InterpolationValues = Record<string, string | number | boolean | Date | object>;

export function interpolate(template: string, values?: InterpolationValues): string {
	if (!values) return template;
	return template.replace(/\{(\w+)\}/g, (_, key) => {
		if (key in values) {
			const value = values[key];
			if (value instanceof Date) return value.toISOString();
			if (typeof value === 'object') return JSON.stringify(value);
			return String(value);
		}
		if (DEV) {
			console.warn(`[i18n] Missing interpolation variable "{${key}}" in template: "${template}"`);
		}
		return `{${key}}`;
	});
}
