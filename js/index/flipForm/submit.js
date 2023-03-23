import { getCurrentChoiceIsHeads } from "@/js/index/flipForm/choiceSelect";
import { getCurrentAmount } from "@/js/index/flipForm/amountSelect";
import { flipLocalTx, flipSendTx, flipTx } from "@/js/lib/kcf/tx";
import { getCurrentWallet } from "@/js/common/connectedWallet";
import { toExplorerLink } from "@/js/lib/kda/utils";
import { spawnModal } from "@/js/index/dialogs/dialogTemplates";
import { addPendingFlip } from "@/js/common/pendingFlips";
import { startPollFlipsLoop } from "@/js/index/pollFlipsLoop";

const INVISIBLE_CLASS = "invisible";
const ROTATING_CLASS = "rotating";
const ROTATING_Y_CLASS = "rotating-y";

/** @type {null | ReturnType<setInterval>} */
let secsElapsedInterval = null;

/**
 *
 * @param {SubmitEvent} event
 */
async function onSubmit(event) {
  event.preventDefault();

  const wallet = getCurrentWallet();
  if (!wallet) {
    /** @type {HTMLDialogElement} */
    // @ts-ignore
    const dialog = document.getElementById("connect-wallet-dialog");
    dialog.showModal();
    return;
  }

  const isHeads = getCurrentChoiceIsHeads();
  const amount = getCurrentAmount();
  const tx = flipTx({
    pubKey: wallet.pubKey,
    player: wallet.account,
    amount,
    isHeads,
  });

  /** @type {HTMLDialogElement} */
  // @ts-ignore
  const inProgressDialog = document.getElementById("in-progress-dialog");

  /** @type {HTMLElement} */
  // @ts-ignore
  const footer = inProgressDialog.querySelector("footer");

  /** @type {HTMLParagraphElement} */
  // @ts-ignore
  const prompt = document.getElementById("in-progress-dialog-prompt");

  /** @type {HTMLImageElement} */
  // @ts-ignore
  const coinImg = document.getElementById("in-progress-dialog-coin-img");

  /** @type {HTMLAnchorElement} */
  // @ts-ignore
  const inProgressDialogViewOnExplorerA =
    document.getElementById("view-on-explorer-a");

  inProgressDialog.showModal();

  coinImg.classList.add(ROTATING_CLASS);
  footer.classList.add(INVISIBLE_CLASS);
  // TODO: i18n
  prompt.innerText = "Awaiting signature...";
  let toSend;
  try {
    toSend = await wallet.signCmd(tx);
  } catch (e) {
    inProgressDialog.close();
    onError(e);
    return;
  }

  footer.classList.remove(INVISIBLE_CLASS);
  coinImg.classList.remove(ROTATING_CLASS);
  coinImg.classList.add(ROTATING_Y_CLASS);
  prompt.innerText = "Please do not close this window";
  restartSecsElapsedInterval();

  /** @type {string | undefined} */
  let reqKey;
  try {
    // /local to make sure sim works first
    const localRes = await flipLocalTx(toSend);
    // console.log(localRes);
    if (localRes.result.status === "failure") {
      throw new Error(JSON.stringify(localRes.result.error));
    }
    const {
      requestKeys: [reqKeyReturn],
    } = await flipSendTx(toSend);
    reqKey = reqKeyReturn;
  } catch (e) {
    inProgressDialog.close();
    onError(e, reqKey);
    return;
  }
  // TODO: i18n
  prompt.innerHTML =
    "Safe to exit page.<br/>You will be notified when the flip is complete.";
  inProgressDialogViewOnExplorerA.href = toExplorerLink(reqKey);

  addPendingFlip(wallet.account, {
    reqKey,
    amount,
    expiration: Date.now() + tx.publicMeta.ttl * 1000,
  });
  startPollFlipsLoop();
}

/**
 *
 * @param {Error} e
 * @param {string} [reqKey]
 */
function onError(e, reqKey) {
  console.log(e);
  const dialog = spawnModal("error-dialog-template");
  /** @type {HTMLParagraphElement} */
  // @ts-ignore
  const errP = dialog.getElementsByClassName("flip-error-msg")[0];
  errP.innerText = e.message ?? JSON.stringify(e);
  /** @type {HTMLAnchorElement} */
  // @ts-ignore
  const viewOnExplorerLink =
    dialog.getElementsByClassName("view-on-explorer-a")[0];
  if (reqKey) {
    viewOnExplorerLink.href = toExplorerLink(reqKey);
  } else {
    // cant dialog.removeChild since its not a direct child
    viewOnExplorerLink.classList.add("hidden");
  }
}

function stopSecsElapsedInterval() {
  if (secsElapsedInterval !== null) {
    clearInterval(secsElapsedInterval);
  }
  secsElapsedInterval = null;
  const elapsedSpan = document.getElementById("in-progress-dialog-time");
  if (!elapsedSpan) {
    throw new Error("elapsedSpan undefined");
  }
  elapsedSpan.innerText = "0";
}

function restartSecsElapsedInterval() {
  stopSecsElapsedInterval();
  let s = 0;
  secsElapsedInterval = setInterval(() => {
    const elapsedSpan = document.getElementById("in-progress-dialog-time");
    if (!elapsedSpan) {
      throw new Error("elapsedSpan undefined");
    }
    s += 1;
    elapsedSpan.innerText = s.toString();
  }, 1000);
}

function onPageParsed() {
  /** @type {HTMLFormElement} */
  // @ts-ignore
  const form = document.getElementById("flip-form");
  form.onsubmit = onSubmit;
}

onPageParsed();
