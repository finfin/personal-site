import 'server-only'

const dictionaries = {
  en: () => import('../../dictionaries/en.json').then((module) => module.default),
  "zh-TW": () => import('../../dictionaries/zh-TW.json').then((module) => module.default),
}

export const getDictionary = async (locale) => dictionaries[locale]()
