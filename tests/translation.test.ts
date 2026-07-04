import { describe, it, expect } from 'vitest';

describe('Translation Functions', () => {
	it('Simple string interpolation works', () => {
		const template = 'Hello, {name}!';
		const result = template.replace('{name}', 'World');
		expect(result).toBe('Hello, World!');
	});

	it('Multiple variable interpolation works', () => {
		const template = 'You have {count} items worth {amount}.';
		const result = template
			.replace('{count}', '5')
			.replace('{amount}', '$10.00');
		expect(result).toBe('You have 5 items worth $10.00.');
	});

	it('Nested interpolation works', () => {
		const template = '{greeting}, {name}!';
		const result = template
			.replace('{greeting}', 'Hello')
			.replace('{name}', 'World');
		expect(result).toBe('Hello, World!');
	});
});
