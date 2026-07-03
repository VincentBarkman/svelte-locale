export interface LocaleDefinition {
	name: string;
	dir: 'ltr' | 'rtl';
}

const localeRegistry: Record<string, LocaleDefinition> = {
	// BCP 47 regional variants
	'en-US': { name: 'English (US)', dir: 'ltr' },
	'en-GB': { name: 'English (UK)', dir: 'ltr' },
	'en-AU': { name: 'English (Australia)', dir: 'ltr' },
	'en-CA': { name: 'English (Canada)', dir: 'ltr' },
	'fr-FR': { name: 'Français (France)', dir: 'ltr' },
	'fr-CA': { name: 'Français (Canada)', dir: 'ltr' },
	'fr-BE': { name: 'Français (Belgique)', dir: 'ltr' },
	'fr-CH': { name: 'Français (Suisse)', dir: 'ltr' },
	'de-DE': { name: 'Deutsch (Deutschland)', dir: 'ltr' },
	'de-AT': { name: 'Deutsch (Österreich)', dir: 'ltr' },
	'de-CH': { name: 'Deutsch (Schweiz)', dir: 'ltr' },
	'es-ES': { name: 'Español (España)', dir: 'ltr' },
	'es-MX': { name: 'Español (México)', dir: 'ltr' },
	'es-AR': { name: 'Español (Argentina)', dir: 'ltr' },
	'es-CO': { name: 'Español (Colombia)', dir: 'ltr' },
	'pt-PT': { name: 'Português (Portugal)', dir: 'ltr' },
	'pt-BR': { name: 'Português (Brasil)', dir: 'ltr' },
	'zh-CN': { name: '中文 (简体)', dir: 'ltr' },
	'zh-TW': { name: '中文 (繁體)', dir: 'ltr' },
	'zh-HK': { name: '中文 (香港)', dir: 'ltr' },
	'ar-SA': { name: 'العربية (السعودية)', dir: 'rtl' },
	'ar-EG': { name: 'العربية (مصر)', dir: 'rtl' },
	'nl-NL': { name: 'Nederlands (Nederland)', dir: 'ltr' },
	'nl-BE': { name: 'Nederlands (België)', dir: 'ltr' },
	'it-IT': { name: 'Italiano (Italia)', dir: 'ltr' },
	'it-CH': { name: 'Italiano (Svizzera)', dir: 'ltr' },
	'nb-NO': { name: 'Norsk bokmål (Norge)', dir: 'ltr' },
	'nn-NO': { name: 'Nynorsk (Norge)', dir: 'ltr' },
	'sv-SE': { name: 'Svenska (Sverige)', dir: 'ltr' },
	'fi-FI': { name: 'Suomi (Suomi)', dir: 'ltr' },
	'da-DK': { name: 'Dansk (Danmark)', dir: 'ltr' },
	'pl-PL': { name: 'Polski (Polska)', dir: 'ltr' },
	'ru-RU': { name: 'Русский (Россия)', dir: 'ltr' },
	'uk-UA': { name: 'Українська (Україна)', dir: 'ltr' },
	'ja-JP': { name: '日本語 (日本)', dir: 'ltr' },
	'ko-KR': { name: '한국어 (대한민국)', dir: 'ltr' },
	'hi-IN': { name: 'हिन्दी (भारत)', dir: 'ltr' },
	// ISO 639-1 base codes
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
	if (localeRegistry[locale]) return localeRegistry[locale].dir;
	const base = locale.split('-')[0];
	return localeRegistry[base]?.dir ?? 'ltr';
}

export function getBaseLocale(locale: string): string {
	return locale.split('-')[0];
}

export function normalizeLocale(locale: string): string {
	const parts = locale.split('-');
	if (parts.length === 1) return parts[0].toLowerCase();
	return parts[0].toLowerCase() + '-' + parts[1].toUpperCase();
}

export function defineLocale(code: string, definition: LocaleDefinition): void {
	localeRegistry[code] = definition;
}

export function getLocaleRegistry(): Readonly<Record<string, LocaleDefinition>> {
	return localeRegistry;
}
