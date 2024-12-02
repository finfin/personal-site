import 'server-only'
import type { Locale } from './i18n-config'

const dictionaries = {
    en: () => import('./locales/en').then((module) => module.default),
    'zh-TW': () => import('./locales/zh-TW').then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => dictionaries[locale]()
