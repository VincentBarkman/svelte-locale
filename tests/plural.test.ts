import { describe, it, expect } from 'vitest';

describe('Pluralization', () => {
	it('Intl.PluralRules handles English one/other', () => {
		const enRules = new Intl.PluralRules('en-US');
		expect(enRules.select(1)).toBe('one');
		expect(enRules.select(2)).toBe('other');
		expect(enRules.select(0)).toBe('other');
	});

	it('Intl.PluralRules handles Swedish one/other', () => {
		const svRules = new Intl.PluralRules('sv-SE');
		expect(svRules.select(1)).toBe('one');
		expect(svRules.select(2)).toBe('other');
		expect(svRules.select(0)).toBe('other');
	});

	it('Plural entry mapping works', () => {
		const pluralEntry: Record<string, string> = {
			one: '{count} item',
			other: '{count} items'
		};
		
		const enRules = new Intl.PluralRules('en-US');
		const oneKey = enRules.select(1);
		const otherKey = enRules.select(5);
		
		expect(pluralEntry[oneKey]).toBe('{count} item');
		expect(pluralEntry[otherKey]).toBe('{count} items');
	});
});
