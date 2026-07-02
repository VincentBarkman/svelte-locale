export interface LocaleDefinition {
	name: string;
	dir: 'ltr' | 'rtl';
}

const localeRegistry: Record<string, LocaleDefinition> = {
	af: { name: 'Afrikaans', dir: 'ltr' },
	sq: { name: 'Shqip', dir: 'ltr' },
	am: { name: 'አማርኛ', dir: 'ltr' },
	ar: { name: 'العربية', dir: 'rtl' },
	hy: { name: 'Հայերեն', dir: 'ltr' },
	az: { name: 'Azərbaycan', dir: 'ltr' },
	eu: { name: 'Euskara', dir: 'ltr' },
	be: { name: 'Беларуская', dir: 'ltr' },
	bn: { name: 'বাংলা', dir: 'ltr' },
	bs: { name: 'Bosanski', dir: 'ltr' },
	bg: { name: 'Български', dir: 'ltr' },
	ca: { name: 'Català', dir: 'ltr' },
	zh: { name: '中文', dir: 'ltr' },
	hr: { name: 'Hrvatski', dir: 'ltr' },
	cs: { name: 'Čeština', dir: 'ltr' },
	da: { name: 'Dansk', dir: 'ltr' },
	nl: { name: 'Nederlands', dir: 'ltr' },
	en: { name: 'English', dir: 'ltr' },
	eo: { name: 'Esperanto', dir: 'ltr' },
	et: { name: 'Eesti', dir: 'ltr' },
	fi: { name: 'Suomi', dir: 'ltr' },
	fr: { name: 'Français', dir: 'ltr' },
	gl: { name: 'Galego', dir: 'ltr' },
	ka: { name: 'ქართული', dir: 'ltr' },
	de: { name: 'Deutsch', dir: 'ltr' },
	el: { name: 'Ελληνικά', dir: 'ltr' },
	gu: { name: 'ગુજરાતી', dir: 'ltr' },
	ht: { name: 'Kreyòl ayisyen', dir: 'ltr' },
	he: { name: 'עברית', dir: 'rtl' },
	hi: { name: 'हिन्दी', dir: 'ltr' },
	hu: { name: 'Magyar', dir: 'ltr' },
	is: { name: 'Íslenska', dir: 'ltr' },
	id: { name: 'Bahasa Indonesia', dir: 'ltr' },
	ga: { name: 'Gaeilge', dir: 'ltr' },
	it: { name: 'Italiano', dir: 'ltr' },
	ja: { name: '日本語', dir: 'ltr' },
	kn: { name: 'ಕನ್ನಡ', dir: 'ltr' },
	kk: { name: 'Қазақша', dir: 'ltr' },
	km: { name: 'ខ្មែរ', dir: 'ltr' },
	ko: { name: '한국어', dir: 'ltr' },
	ku: { name: 'Kurdî', dir: 'rtl' },
	ky: { name: 'Кыргызча', dir: 'ltr' },
	lo: { name: 'ລາວ', dir: 'ltr' },
	lv: { name: 'Latviešu', dir: 'ltr' },
	lt: { name: 'Lietuvių', dir: 'ltr' },
	mk: { name: 'Македонски', dir: 'ltr' },
	ms: { name: 'Bahasa Melayu', dir: 'ltr' },
	ml: { name: 'മലയാളം', dir: 'ltr' },
	mt: { name: 'Malti', dir: 'ltr' },
	mi: { name: 'Māori', dir: 'ltr' },
	mr: { name: 'मराठी', dir: 'ltr' },
	mn: { name: 'Монгол', dir: 'ltr' },
	ne: { name: 'नेपाली', dir: 'ltr' },
	nb: { name: 'Norsk bokmål', dir: 'ltr' },
	nn: { name: 'Nynorsk', dir: 'ltr' },
	fa: { name: 'فارسی', dir: 'rtl' },
	pl: { name: 'Polski', dir: 'ltr' },
	pt: { name: 'Português', dir: 'ltr' },
	pa: { name: 'ਪੰਜਾਬੀ', dir: 'ltr' },
	ro: { name: 'Română', dir: 'ltr' },
	ru: { name: 'Русский', dir: 'ltr' },
	sr: { name: 'Српски', dir: 'ltr' },
	si: { name: 'සිංහල', dir: 'ltr' },
	sk: { name: 'Slovenčina', dir: 'ltr' },
	sl: { name: 'Slovenščina', dir: 'ltr' },
	so: { name: 'Soomaali', dir: 'ltr' },
	es: { name: 'Español', dir: 'ltr' },
	sw: { name: 'Kiswahili', dir: 'ltr' },
	sv: { name: 'Svenska', dir: 'ltr' },
	tl: { name: 'Filipino', dir: 'ltr' },
	tg: { name: 'Тоҷикӣ', dir: 'ltr' },
	ta: { name: 'தமிழ்', dir: 'ltr' },
	te: { name: 'తెలుగు', dir: 'ltr' },
	th: { name: 'ภาษาไทย', dir: 'ltr' },
	tr: { name: 'Türkçe', dir: 'ltr' },
	tk: { name: 'Türkmen', dir: 'ltr' },
	uk: { name: 'Українська', dir: 'ltr' },
	ur: { name: 'اردو', dir: 'rtl' },
	uz: { name: "O'zbek", dir: 'ltr' },
	vi: { name: 'Tiếng Việt', dir: 'ltr' },
	cy: { name: 'Cymraeg', dir: 'ltr' },
	fy: { name: 'Frysk', dir: 'ltr' },
	yi: { name: 'ייִדיש', dir: 'rtl' },
	yo: { name: 'Yorùbá', dir: 'ltr' },
	zu: { name: 'isiZulu', dir: 'ltr' }
};

export function getLocaleName(locale: string): string {
	return localeRegistry[locale]?.name ?? locale.toUpperCase();
}

export function getLocaleDir(locale: string): 'ltr' | 'rtl' {
	return localeRegistry[locale]?.dir ?? 'ltr';
}

export function defineLocale(code: string, definition: LocaleDefinition): void {
	localeRegistry[code] = definition;
}

export function getLocaleRegistry(): Readonly<Record<string, LocaleDefinition>> {
	return localeRegistry;
}
