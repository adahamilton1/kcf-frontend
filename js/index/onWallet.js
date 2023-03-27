import { getCurrentWallet } from "@/js/common/connectedWallet";
import { HIDDEN_CLASS_NAME } from "@/js/common/consts";
import { truncateStrEllipsis } from "@/js/common/utils";
import { startPollFlipsLoop } from "@/js/index/pollFlipsLoop";

const CONNECT_WALLET_BUTTON_ID = "connect-wallet-button";
const WALLET_CONNECTED_DIV_ID = "wallet-connected-div";
const FLIP_SUBMIT_BUTTON_ID = "flip-submit-button";

export function onWalletChanged() {
  const w = getCurrentWallet();
  if (w) {
    onWalletConnected(w);
  } else {
    onWalletDisconnected();
  }
}

/**
 *
 * @param {import("@/js/lib/kda/walletAdapter/walletAdapter").WalletAdapter} currentWallet
 */
function onWalletConnected(currentWallet) {
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const connectBtn = document.getElementById(CONNECT_WALLET_BUTTON_ID);
  if (!connectBtn.classList.contains(HIDDEN_CLASS_NAME)) {
    connectBtn.classList.add(HIDDEN_CLASS_NAME);
  }
  /** @type {HTMLDivElement} */
  // @ts-ignore
  const walletConnectedDiv = document.getElementById(WALLET_CONNECTED_DIV_ID);
  if (walletConnectedDiv.classList.contains(HIDDEN_CLASS_NAME)) {
    walletConnectedDiv.classList.remove(HIDDEN_CLASS_NAME);
  }
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const walletButton = document.getElementById("wallet-button");
  walletButton.innerText = truncateStrEllipsis(currentWallet.account, 6, 4);
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const flipSubmitBtn = document.getElementById(FLIP_SUBMIT_BUTTON_ID);
  // TODO: I18N
  flipSubmitBtn.innerText = "contract paused"; // double or nothing
  startPollFlipsLoop();
}

function onWalletDisconnected() {
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const connectBtn = document.getElementById(CONNECT_WALLET_BUTTON_ID);
  if (connectBtn.classList.contains(HIDDEN_CLASS_NAME)) {
    connectBtn.classList.remove(HIDDEN_CLASS_NAME);
  }
  /** @type {HTMLDivElement} */
  // @ts-ignore
  const walletConnectedDiv = document.getElementById(WALLET_CONNECTED_DIV_ID);
  if (!walletConnectedDiv.classList.contains(HIDDEN_CLASS_NAME)) {
    walletConnectedDiv.classList.add(HIDDEN_CLASS_NAME);
  }
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const flipSubmitBtn = document.getElementById(FLIP_SUBMIT_BUTTON_ID);
  // TODO: I18N
  flipSubmitBtn.innerText = "connect wallet to play";
}
