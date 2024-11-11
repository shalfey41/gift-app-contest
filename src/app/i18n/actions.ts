'use server';

import { cookies } from 'next/headers';
import { LANG_COOKIE } from '@/modules/i18n/types';

export const setLanguageCookie = async (lang?: string) => {
  const cookieStore = await cookies();

  cookieStore.set(LANG_COOKIE, lang || 'en');
};
