import { ChainweaverQuickSignWallet } from "@/js/lib/kda/walletAdapter/chainweaverQuickSignWallet";
import { EckoWallet } from "@/js/lib/kda/walletAdapter/eckoWallet";

/**
 * @typedef {"chainweaver" | "eckowallet"} WalletType
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
  if (wallet instanceof ChainweaverQuickSignWallet) {
    return "chainweaver";
  }
  if (wallet instanceof EckoWallet) {
    return "eckowallet";
  }
  throw new Error(`cant determine wallet type for ${wallet}`);
}

/**
 * @type {Record<WalletType, typeof import("@/js/lib/kda/walletAdapter/walletAdapter").WalletAdapter>}
 */
const WALLET_TYPE_TO_CLASS = {
  chainweaver: ChainweaverQuickSignWallet,
  eckowallet: EckoWallet,
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
 * @param {typeof import("@/js/lib/kda/walletAdapter/walletAdapter").WalletAdapter}  cls
 * @param {import("@/js/lib/kda/walletAdapter/walletAdapter").ConnectWalletArgs} args
 */
export async function connectWallet(cls, args) {
  CONNECTED_WALLET.w = await cls.connect(args);
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
  CONNECTED_WALLET.w.disconnect();
  CONNECTED_WALLET.w = null;
  window.localStorage.removeItem(CONNECTED_WALLET_LOCALSTORAGE_KEY);
}
