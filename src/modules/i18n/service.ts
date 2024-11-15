import { cookies } from 'next/headers';
import { LANG_COOKIE } from '@/modules/i18n/types';
import i18n from 'i18next';
import en from '@/modules/i18n/locales/en.json';
import ru from '@/modules/i18n/locales/ru.json';

export const getLanguageCookie = async () => {
  const cookieStore = await cookies();

  return cookieStore.get(LANG_COOKIE)?.value;
};

export const getI18n = async (lang?: string) => {
  let language = lang;

  if (!language) {
    language = await getLanguageCookie();
  }

  return i18n.init({
    resources: {
      en: {
        translation: en,
      },
      ru: {
        translation: ru,
      },
    },
    lng: language,
    fallbackLng: 'en',
  });
};
