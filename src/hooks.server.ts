import type { Handle } from '@sveltejs/kit';
import { handleI18n } from '$lib/i18n/server';

export const handle: Handle = handleI18n();
