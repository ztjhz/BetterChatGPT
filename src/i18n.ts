import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || undefined;

export const i18nLanguages = [
  // 'ar',
  'da',
  'en',
  'en-GB',
  'en-US',
  'es',
  'fr',
  'fr-FR',
  'it',
  'ja',
  'ms',
  'nb',
  'sv',
  // 'ug',
  'yue',
  'zh-CN',
  'zh-HK',
  'zh-TW',
];

const namespace = ['main', 'api', 'about', 'model'];
if (googleClientId) namespace.push('drive');

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: 'locales/{{lng}}/{{ns}}.json',
    },
    fallbackLng: {
      default: ['en'],
    },
    ns: namespace,
    defaultNS: 'main',
  });

export default i18n;
