import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/modules/i18n/locales/en.json';
import ru from '@/modules/i18n/locales/ru.json';
import WebApp from '@twa-dev/sdk';

export type Language = 'en' | 'ru';

const CsLangKey = 'language';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: en,
      },
      ru: {
        translation: ru,
      },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });

export const initLanguage = () => {
  WebApp.CloudStorage.getItem(CsLangKey, (error, result) => {
    const language = result || WebApp.initDataUnsafe.user?.language_code;

    if (!language) {
      return;
    }

    i18n.changeLanguage(language);
    document.documentElement.lang = language;
  });
};

export const changeLanguage = (language: Language) => {
  WebApp.CloudStorage.setItem(CsLangKey, language);
  i18n.changeLanguage(language);
  document.documentElement.lang = language;
};

export const getLanguage = () => {
  return i18n.language as Language;
};