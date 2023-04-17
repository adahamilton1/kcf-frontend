import {
  WALLET_CONNECTED_EVENT_NAME,
  WALLET_DISCONNECTED_EVENT_NAME,
  WALLET_ERROR_EVENT_NAME,
} from "@kcf/kda-wallet-web-components-base";
import { HIDDEN_CLASS_NAME } from "@/js/common/consts";
import { truncateStrEllipsis } from "@/js/common/utils";
import { getConnectedAccountPubkey } from "@/js/lib/kcf/utils";
import { getResultTextArea, updateResult } from "@/js/index/form/utils";

const CONNECT_WALLET_BUTTON_ID = "connect-wallet-button";
const WALLET_CONNECTED_DIV_ID = "wallet-connected-div";
// TODO: toggle submit disabled
// const FLIP_SUBMIT_BUTTON_ID = "flip-submit-button";

/**
 * @returns {import("@kcf/kda-wallet-connect-dialog").KdaWalletConnectDialog}
 */
export function getConnectWalletDialog() {
  // @ts-ignore
  return document.querySelector("kda-wallet-connect-dialog");
}

function hideConnectBtn() {
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const connectBtn = document.getElementById(CONNECT_WALLET_BUTTON_ID);
  if (!connectBtn.classList.contains(HIDDEN_CLASS_NAME)) {
    connectBtn.classList.add(HIDDEN_CLASS_NAME);
  }
}

function showConnectBtn() {
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const connectBtn = document.getElementById(CONNECT_WALLET_BUTTON_ID);
  if (connectBtn.classList.contains(HIDDEN_CLASS_NAME)) {
    connectBtn.classList.remove(HIDDEN_CLASS_NAME);
  }
}

function hideWalletConnectedDiv() {
  /** @type {HTMLDivElement} */
  // @ts-ignore
  const walletConnectedDiv = document.getElementById(WALLET_CONNECTED_DIV_ID);
  if (!walletConnectedDiv.classList.contains(HIDDEN_CLASS_NAME)) {
    walletConnectedDiv.classList.add(HIDDEN_CLASS_NAME);
  }
}

/**
 *
 * @param {import("@kcf/kda-wallet-base").KdaWallet} currentWallet
 */
function showWalletConnectedDiv(currentWallet) {
  const { account } = getConnectedAccountPubkey(currentWallet);
  /** @type {HTMLDivElement} */
  // @ts-ignore
  const walletConnectedDiv = document.getElementById(WALLET_CONNECTED_DIV_ID);
  if (walletConnectedDiv.classList.contains(HIDDEN_CLASS_NAME)) {
    walletConnectedDiv.classList.remove(HIDDEN_CLASS_NAME);
  }
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const walletButton = document.getElementById("wallet-button");
  walletButton.innerText = truncateStrEllipsis(account, 6, 4);
}

/**
 *
 * @returns {HTMLButtonElement[]}
 */
function getAllSignButtons() {
  return [
    // @ts-ignore
    document.getElementById("sign-simulate-button"),
    // @ts-ignore
    document.getElementById("sign-send-button"),
    // @ts-ignore
    document.getElementById("quicksign-simulate-button"),
    // @ts-ignore
    document.getElementById("quicksign-send-button"),
  ];
}

function disableSignButtons() {
  getAllSignButtons().forEach((btn) => {
    if (!btn.hasAttribute("disabled")) {
      btn.setAttribute("disabled", "");
    }
  });
}

function enableSignButtons() {
  getAllSignButtons().forEach((btn) => {
    while (btn.hasAttribute("disabled")) {
      btn.removeAttribute("disabled");
    }
  });
}

/**
 *
 * @param {CustomEvent<import("@kcf/kda-wallet-web-components-base").WalletConnectedEvent>} event
 */
function onWalletConnected(event) {
  const {
    detail: { wallet },
  } = event;
  hideConnectBtn();
  showWalletConnectedDiv(wallet);
  enableSignButtons();
}

/**
 *
 * @param {CustomEvent<import("@kcf/kda-wallet-web-components-base").WalletDisconnectedEvent>} _event
 */
function onWalletDisconnected(_event) {
  showConnectBtn();
  hideWalletConnectedDiv();
  disableSignButtons();
}

/**
 *
 * @param {CustomEvent<import("@kcf/kda-wallet-web-components-base").WalletErrorEvent>} event
 */
function onWalletError(event) {
  const {
    detail: { error },
  } = event;
  updateResult(error.message, true);
  getResultTextArea().focus();
}

function onPageParsed() {
  const connectWalletDialog = getConnectWalletDialog();
  connectWalletDialog.addEventListener(
    WALLET_CONNECTED_EVENT_NAME,
    onWalletConnected
  );
  connectWalletDialog.addEventListener(
    WALLET_DISCONNECTED_EVENT_NAME,
    onWalletDisconnected
  );
  connectWalletDialog.addEventListener(WALLET_ERROR_EVENT_NAME, onWalletError);
}

onPageParsed();
