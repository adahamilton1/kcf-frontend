/**
 * @param {any} obj
 * @param {string} dotstr
 * @returns {string | undefined}
 */
export function indexDotStr(obj, dotstr) {
  return dotstr.split(".").reduce((o, i) => o[i], obj);
}

/**
 *
 * @param {string} str "0" or "1"
 * @returns {boolean}
 */
export function zeroOneStrToBool(str) {
  return Boolean(Number(str));
}

/**
 *
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 *
 * @param {string} s
 * @param {number} prefixLen
 * @param {number} suffixLen
 */
export function truncateStrEllipsis(s, prefixLen, suffixLen) {
  if (s.length <= prefixLen + suffixLen + 3) {
    return s;
  }
  return `${s.substring(0, prefixLen)}...${s.substring(
    s.length - suffixLen,
    s.length
  )}`;
}
