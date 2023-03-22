import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

<<<<<<< HEAD
export const i18nLanguages = ['en', 'es', 'da', 'zh-CN', 'zh-HK'];
=======
export const i18nLanguages = ['da', 'en', 'nb', 'sv', 'zh-CN', 'zh-HK', 'zh-TW'];
>>>>>>> 4c87b0d5479d0bca2ae4eca62067d5377db0c065

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: {
      default: ['en'],
    },
    ns: ['main', 'api', 'about', 'model'],
    defaultNS: 'main',
  });

export default i18n;
