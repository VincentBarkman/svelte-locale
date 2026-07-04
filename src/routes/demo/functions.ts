import i18n from '$lib/i18n/namespace';

i18n.defineFunctions({
	'en-US': {
		'demo.currency': (amount: number) => `$${amount.toFixed(2)}`
	},
	'sv-SE': {
		'demo.currency': (amount: number) => `${amount.toFixed(2)} kr`
	}
});
