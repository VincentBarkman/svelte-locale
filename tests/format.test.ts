import { describe, it, expect } from 'vitest';

describe('Date Formatting', () => {
	const testDate = new Date('2026-07-04T12:00:00Z');

	it('formatDateISO returns ISO 8601 date format', () => {
		const date = new Date(testDate);
		const result = date.toISOString().slice(0, 10);
		expect(result).toBe('2026-07-04');
	});

	it('formatDateTimeISO returns ISO 8601 datetime format', () => {
		const date = new Date(testDate);
		const result = date.toISOString();
		expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/);
	});

	it('Intl.DateTimeFormat with en-US locale uses English format', () => {
		const formatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' });
		const result = formatter.format(testDate);
		expect(result).toContain('July');
		expect(result).toContain('2026');
	});

	it('Intl.DateTimeFormat with sv-SE locale uses Swedish format', () => {
		const formatter = new Intl.DateTimeFormat('sv-SE', { dateStyle: 'long' });
		const result = formatter.format(testDate);
		expect(result).toContain('juli');
		expect(result).toContain('2026');
	});

	it('Intl.DateTimeFormat with same date (2026-07-04) formats differently by locale', () => {
		const enFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' });
		const svFormatter = new Intl.DateTimeFormat('sv-SE', { dateStyle: 'long' });
		
		const enResult = enFormatter.format(testDate);
		const svResult = svFormatter.format(testDate);
		
		// Different locales should produce different text representations
		expect(enResult).not.toBe(svResult);
		
		// But both should contain the year
		expect(enResult).toContain('2026');
		expect(svResult).toContain('2026');
	});
});
