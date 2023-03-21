import { ATTR_ONLY_OBSERVER_OPTIONS } from "@/js/common/consts";

const DEFAULT_IS_DARK_MODE = false;
const DARK_MODE_LOCALSTORAGE_KEY = "userIsDarkMode";
const DARK_CLASS = "dark";

const DATA_DARK_IMG_SRC_ATTR = "data-dark-img-src";
const DATA_LIGHT_IMG_SRC_ATTR = "data-light-img-src";

/**
 *
 * @param {boolean} isDarkMode
 */
function setIsDarkMode(isDarkMode) {
  const html = document.documentElement;
  if (isDarkMode) {
    html.classList.add(DARK_CLASS);
  } else {
    html.classList.remove(DARK_CLASS);
  }
}

/**
 * Attempts to load the saved dark mode setting from localStorage
 * @returns {boolean | null} the saved dark mode setting, null if not saved
 */
function loadIsDarkMode() {
  const opt = window.localStorage.getItem(DARK_MODE_LOCALSTORAGE_KEY);
  if (opt === null || opt === undefined) {
    return null;
  }
  return Boolean(Number(opt));
}

/**
 *
 * @param {boolean} isDarkMode the user dark mode setting to save
 */
function saveIsDarkMode(isDarkMode) {
  window.localStorage.setItem(
    DARK_MODE_LOCALSTORAGE_KEY,
    Number(isDarkMode).toString()
  );
}

/**
 * @param {boolean} isDarkMode the user dark mode setting to set and save
 */
export function setAndSaveIsDarkMode(isDarkMode) {
  setIsDarkMode(isDarkMode);
  saveIsDarkMode(isDarkMode);
}

/**
 * @returns {[boolean, boolean]} [stored user isDarkMode or default=false if not exists, isDefault]
 */
export function loadIsDarkModeOrDefault() {
  const maybeDarkMode = loadIsDarkMode();
  if (!maybeDarkMode) {
    return [DEFAULT_IS_DARK_MODE, true];
  }
  return [maybeDarkMode, false];
}

/**
 * @returns {boolean} is the page currently set to dark mode
 */
export function isCurrentlyDarkMode() {
  return document.documentElement.classList.contains(DARK_CLASS);
}

function rerenderImgs() {
  const toggleableImgs = document.querySelectorAll(
    `img[${DATA_DARK_IMG_SRC_ATTR}][${DATA_LIGHT_IMG_SRC_ATTR}]`
  );
  toggleableImgs.forEach(rerenderImg);
}

/**
 *
 * @param {HTMLImageElement} img
 */
export function rerenderImg(img) {
  const newSrc = isCurrentlyDarkMode()
    ? img.getAttribute(DATA_DARK_IMG_SRC_ATTR)
    : img.getAttribute(DATA_LIGHT_IMG_SRC_ATTR);
  if (!newSrc) {
    throw new Error("missing dark mode img data attributes");
  }
  img.src = newSrc;
}

/**
 * @type {MutationCallback}
 */
function onHtmlChanged(mutationList) {
  // target is guaranteed to be <html> since subtree: false
  mutationList.forEach(({ attributeName }) => {
    if (attributeName === "class") {
      rerenderImgs();
    }
  });
}

/**
 * Set initial dark mode when page is parsed
 */
function onPageParsed() {
  const [isDarkMode, isDefault] = loadIsDarkModeOrDefault();
  if (isDefault) {
    saveIsDarkMode(isDarkMode);
  }
  setIsDarkMode(isDarkMode);

  new MutationObserver(onHtmlChanged).observe(
    document.documentElement,
    ATTR_ONLY_OBSERVER_OPTIONS
  );
  // initial setup
  rerenderImgs();
}

onPageParsed();
