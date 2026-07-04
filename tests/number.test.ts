import { describe, it, expect } from 'vitest';

describe('Number Formatting', () => {
	it('Intl.NumberFormat formats basic numbers', () => {
		const formatter = new Intl.NumberFormat('en-US');
		expect(formatter.format(1234567.89)).toBe('1,234,567.89');
	});

	it('Intl.NumberFormat with sv-SE uses Swedish formatting', () => {
		const formatter = new Intl.NumberFormat('sv-SE');
		const result = formatter.format(1234567.89);
		expect(result).toContain('1');
		expect(result).toContain('234');
		expect(result).toContain('567');
		expect(result).toContain(',');
	});

	it('Intl.NumberFormat with currency formats USD', () => {
		const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
		expect(formatter.format(99.99)).toBe('$99.99');
	});

	it('Intl.NumberFormat with currency formats SEK', () => {
		const formatter = new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' });
		const result = formatter.format(99.99);
		expect(result).toContain('99,99');
		expect(result).toContain('kr');
	});
});
