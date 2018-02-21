import de from "./de"

const locales = {
  de
}
const defaultLocale = "de"
const getLocale = locale => locales[locale in locales ? locale : defaultLocale]

export { getLocale, defaultLocale }
