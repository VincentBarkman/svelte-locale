import i18n from '../i18n/namespace';

i18n.defineFunctions({
	en: {
		'demo.currency': (amount: number) => `$${amount.toFixed(2)}`
	},
	sv: {
		'demo.currency': (amount: number) => `${amount.toFixed(2)} kr`
	}
});
