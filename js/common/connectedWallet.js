import { ChainweaverWallet } from "@/js/lib/kda/walletAdapter/chainweaverWallet";

/**
 * @typedef {"chainweaver"} WalletType
 */

/**
 * @typedef SavedWallet
 * @property {WalletType} wallet
 * @property {string} account
 * @property {string} pubKey
 */

const CONNECTED_WALLET_LOCALSTORAGE_KEY = "connectedwallet";

const CONNECTED_WALLET = {
  /** @type {?import("@/js/lib/kda/walletAdapter/walletAdapter").WalletAdapter} */
  w: null,
};

/**
 * Tried to do a constructor name to wallet type look-up table but
 * constructor names get fukt during minification so they only work in dev not prod
 * @param {import("@/js/lib/kda/walletAdapter/walletAdapter").WalletAdapter} wallet
 * @returns {WalletType}
 */
function determineWalletType(wallet) {
  if (wallet instanceof ChainweaverWallet) {
    return "chainweaver";
  }
  throw new Error(`cant determined wallet type for ${wallet}`);
}

/**
 * @type {Record<WalletType, typeof import("@/js/lib/kda/walletAdapter/walletAdapter").WalletAdapter>}
 */
const WALLET_TYPE_TO_CLASS = {
  chainweaver: ChainweaverWallet,
};

export function getCurrentWallet() {
  return CONNECTED_WALLET.w;
}

function saveConnectedWallet() {
  if (!CONNECTED_WALLET.w) {
    throw new Error("no wallet connected");
  }
  const { account, pubKey } = CONNECTED_WALLET.w;
  /** @type {SavedWallet} */
  const saved = {
    wallet: determineWalletType(CONNECTED_WALLET.w),
    account,
    pubKey,
  };
  window.localStorage.setItem(
    CONNECTED_WALLET_LOCALSTORAGE_KEY,
    JSON.stringify(saved)
  );
}

/**
 *
 * @param {import("@/js/lib/kda/walletAdapter/walletAdapter").ConnectWalletArgs} args
 */
export async function connectChainweaverWallet(args) {
  CONNECTED_WALLET.w = await ChainweaverWallet.connect(args);
  saveConnectedWallet();
}

/**
 * @param {SavedWallet} args
 */
async function loadConnectedWallet({ wallet, account, pubKey }) {
  CONNECTED_WALLET.w = await WALLET_TYPE_TO_CLASS[wallet].connect({
    account,
    pubKey,
  });
  saveConnectedWallet();
}

export async function tryLoadConnectedWallet() {
  const connectedWalletOpt = window.localStorage.getItem(
    CONNECTED_WALLET_LOCALSTORAGE_KEY
  );
  if (!connectedWalletOpt) {
    return;
  }
  await loadConnectedWallet(JSON.parse(connectedWalletOpt));
}

export function disconnectWallet() {
  if (!CONNECTED_WALLET.w) {
    throw new Error("no wallet connected");
  }
  CONNECTED_WALLET.w = null;
  window.localStorage.removeItem(CONNECTED_WALLET_LOCALSTORAGE_KEY);
}
