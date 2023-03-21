import { pollTxs } from "@/js/lib/kda/utils";
import {
  DEFAULT_CHAINWEB_ENDPOINT,
  DEFAULT_NETWORK_ID,
  KCF_CHAIN_ID,
} from "@/js/lib/kcf/consts";
import { UnreachableError } from "@/js/common/errs";

const PENDING_FLIPS_LOCALSTORAGE_KEY = "pendingFlips";

/**
 * @typedef PendingFlip
 * @property {string} reqKey
 * @property {number} amount
 * @property {number} expiration in timestamp ms (Date.now() compatible)
 */

/**
 * @typedef CompletedFlip
 * @property {string} reqKey
 * @property {number} amount
 * @property {any} result true if win, false if lose, object if error
 */

/**
 * Map of wallet account to list of pending flip tx's request keys
 * @typedef {Record<string, PendingFlip[]>} PendingFlips
 */

/**
 * @returns {PendingFlips}
 */
function readStorage() {
  const res = window.localStorage.getItem(PENDING_FLIPS_LOCALSTORAGE_KEY);
  if (!res) {
    return {};
  }
  return JSON.parse(res);
}

/**
 *
 * @param {PendingFlips} pendingFlips
 */
function writeStorage(pendingFlips) {
  window.localStorage.setItem(
    PENDING_FLIPS_LOCALSTORAGE_KEY,
    JSON.stringify(pendingFlips)
  );
}

/**
 * @param {string} account
 * @returns {PendingFlip[]}
 */
export function getPendingFlips(account) {
  const read = readStorage();
  return read[account] ?? [];
}

/**
 * @param {string} account
 * @param {PendingFlip} pendingFlip
 * @throws if no wallet currently connected
 */
export function addPendingFlip(account, pendingFlip) {
  const flips = getPendingFlips(account);
  if (!flips.includes(pendingFlip)) {
    flips.push(pendingFlip);
  }
  const updated = readStorage();
  updated[account] = flips;
  writeStorage(updated);
}

/**
 *
 * @param {string} account
 * @param {string[]} reqKeys
 */
export function removePendingFlips(account, reqKeys) {
  const remainingFlips = getPendingFlips(account).filter(
    ({ reqKey }) => !reqKeys.includes(reqKey)
  );
  const updated = readStorage();
  if (remainingFlips.length > 0) {
    updated[account] = remainingFlips;
  } else {
    delete updated[account];
  }
  writeStorage(updated);
}

/**
 * @param {string} account
 * @returns {Promise<CompletedFlip[]>}
 */
export async function pollPendingFlips(account) {
  const flips = getPendingFlips(account);
  if (flips.length === 0) {
    return [];
  }
  const pollResp = await pollTxs(
    DEFAULT_CHAINWEB_ENDPOINT,
    flips.map(({ reqKey }) => reqKey),
    DEFAULT_NETWORK_ID,
    KCF_CHAIN_ID
  );
  return Object.entries(pollResp).map(([reqKey, { result }]) => {
    // dont match index bec entry might be missing
    const match = flips.find(({ reqKey: reqKeyOrig }) => reqKeyOrig === reqKey);
    if (!match) {
      throw new UnreachableError();
    }
    return {
      reqKey,
      amount: match.amount,
      result: result.status === "failure" ? result.error : result.data,
    };
  });
}
