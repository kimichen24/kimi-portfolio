// 数据 / 文案切换入口
// useContent() → 当前语言的数据包（profile / experiences / projects / ...）
// useUI() → 当前语言的界面文案字典（ui.*）
import { useLang } from '../context/LanguageContext'
import * as zh from './content'
import * as en from './content.en'
import { ui } from './i18n'

const zhBundle = { ...zh }
const enBundle = { ...en }

export function useContent() {
  const { lang } = useLang()
  return lang === 'en' ? enBundle : zhBundle
}

export function useUI() {
  const { lang } = useLang()
  return lang === 'en' ? ui.en : ui.zh
}
