const DEFAULT_IS_MUTED = false;
const IS_MUTED_LOCALSTORAGE_KEY = "userIsMuted";

const STATE = {
  isMuted: DEFAULT_IS_MUTED,
};

/**
 * Attempts to load the saved isMuted setting from localStorage
 * @returns {boolean | null} the saved isMuted setting, null if not saved
 */
function loadIsMuted() {
  const opt = window.localStorage.getItem(IS_MUTED_LOCALSTORAGE_KEY);
  if (opt === null || opt === undefined) {
    return null;
  }
  return Boolean(Number(opt));
}

/**
 *
 * @param {boolean} isMuted the user isMuted setting to save
 */
function saveIsMuted(isMuted) {
  window.localStorage.setItem(
    IS_MUTED_LOCALSTORAGE_KEY,
    Number(isMuted).toString()
  );
}

/**
 *
 * @param {boolean} isMuted
 */
function setIsMuted(isMuted) {
  STATE.isMuted = isMuted;
}

/**
 * @param {boolean} isMuted the user isMuted setting to set and save
 */
export function setAndSaveIsMuted(isMuted) {
  setIsMuted(isMuted);
  saveIsMuted(isMuted);
}

/**
 * @returns {[boolean, boolean]} [stored user isMuted or default=false if not exists, isDefault]
 */
export function loadIsMutedOrDefault() {
  const maybeIsMuted = loadIsMuted();
  if (maybeIsMuted === null) {
    return [DEFAULT_IS_MUTED, true];
  }
  return [maybeIsMuted, false];
}

/**
 * @returns {boolean} is the page currently set to dark mode
 */
export function isCurrentlyMuted() {
  return STATE.isMuted;
}

/**
 * Set initial isMuted when page is parsed
 */
function onPageParsed() {
  const [isMuted, isDefault] = loadIsMutedOrDefault();
  if (isDefault) {
    saveIsMuted(isMuted);
  }
  setIsMuted(isMuted);
}

onPageParsed();
