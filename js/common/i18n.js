import { indexDotStr } from "@/js/common/utils";

const DATA_I18N_KEY = "data-i18n-key";
const USER_LANG_KEY = "userLang";
const DEFAULT_LANG = "en";

/**
 *
 * @param {string} lang the locale to set to, e.g. 'en'
 */
async function setLang(lang) {
  // must use relative ../ due to vite dynamic import limitation:
  /** @type {import("@/locales/schema").I18nSchema} */
  const vals = (await import(`../../locales/${lang}/index.js`)).default;
  const elems = document.querySelectorAll(`[${DATA_I18N_KEY}]`);
  elems.forEach((el) => {
    const key = el.getAttribute(DATA_I18N_KEY);
    try {
      if (key === null) {
        throw new Error("Missing data-i18n-key");
      }
      const content = indexDotStr(vals, key);
      if (!content) {
        throw new Error("Missing i18n key");
      }
      el.textContent = content;
    } catch (e) {
      // need to catch since dot str might be undefined in the middle
      console.log("Error:", e, "Key:", key, "Lang:", lang);
    }
  });
  document.documentElement.lang = lang;
}

/**
 * Attempts to load the saved user locale from localStorage
 * @returns {string | null} the saved locale, null if not saved
 */
function loadUserLang() {
  return window.localStorage.getItem(USER_LANG_KEY);
}

/**
 *
 * @param {string} lang the user locale to save
 */
function saveUserLang(lang) {
  window.localStorage.setItem(USER_LANG_KEY, lang);
}

/**
 *
 * @param {string} lang the newly selected lang
 */
export function onLangSelect(lang) {
  const currentLang = document.documentElement.lang;
  if (currentLang === lang) {
    return;
  }
  saveUserLang(lang);
  setLang(lang);
}

/**
 * @returns {[string, boolean]} [stored user lang or default="en" if not exists, isDefault]
 */
export function loadUserLangOrDefault() {
  const maybeUserLang = loadUserLang();
  if (!maybeUserLang) {
    return [DEFAULT_LANG, true];
  }
  return [maybeUserLang, false];
}

function onPageParsed() {
  const [lang, isDefault] = loadUserLangOrDefault();
  if (isDefault) {
    saveUserLang(lang);
  }
  setLang(lang);
}

onPageParsed();
