import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

export const i18nLanguages = ['da', 'en', 'nb-NO', 'zh-CN', 'zh-HK', 'zh-TW'];

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    ns: ['main', 'api', 'about', 'model'],
    defaultNS: 'main',
  });

export default i18n;
