import { getCurrentWallet } from "@/js/common/connectedWallet";
import {
  getPendingFlips,
  pollPendingFlips,
  removePendingFlips,
} from "@/js/common/pendingFlips";
import { sleep } from "@/js/common/utils";
import { spawnModal } from "@/js/index/dialogs/dialogTemplates";
import { toExplorerLink } from "@/js/lib/kda/utils";
import { attachOnClick as attachOnClickPlayAgainButton } from "@/js/index/playAgainButton";
import { isCurrentlyMuted } from "@/js/common/muted";
import { Howl } from "howler";

const POLL_FLIPS_INTERVAL_MS = 10_000;
/** Mainly to stagger SFX */
const DIALOG_SPAWN_CD_MS = 1000;
const STATE = {
  isRunning: false,
};

const WIN_SFX = new Howl({ src: ["/sfx/win.mp3"] });
const LOSE_SFX = new Howl({ src: ["/sfx/lose.mp3"] });

export function startPollFlipsLoop() {
  if (STATE.isRunning) {
    return;
  }
  STATE.isRunning = true;
  pollFlipsLoop();
}

/**
 *
 * @returns when no more pending flips for the current wallet
 */
async function pollFlipsLoop() {
  /* eslint-disable no-await-in-loop */
  while (true) {
    const wallet = getCurrentWallet();
    if (!wallet) {
      break;
    }
    const flips = await pollPendingFlips(wallet.account);
    removePendingFlips(
      wallet.account,
      flips.map(({ reqKey }) => reqKey)
    );
    if (flips.length > 0) {
      /** @type {HTMLDialogElement} */
      // @ts-ignore
      const inProgressDialog = document.getElementById("in-progress-dialog");
      if (inProgressDialog.open) {
        inProgressDialog.close();
      }
    }
    for (const { reqKey, amount, result } of flips) {
      /** @type {HTMLDialogElement} */
      let dialog;
      if (result === true) {
        dialog = spawnModal("win-dialog-template");
        /** @type {HTMLSpanElement} */
        // @ts-ignore
        const amtSpan = dialog.getElementsByClassName("win-dialog-amount")[0];
        amtSpan.innerText = amount.toString();
        /** @type {HTMLButtonElement} */
        // @ts-ignore
        const playAgainButton =
          dialog.getElementsByClassName("play-again-button")[0];
        attachOnClickPlayAgainButton(playAgainButton);
        if (!isCurrentlyMuted()) {
          WIN_SFX.play();
        }
      } else if (result === false) {
        dialog = spawnModal("lose-dialog-template");
        /** @type {HTMLSpanElement} */
        // @ts-ignore
        const amtSpan = dialog.getElementsByClassName("lose-dialog-amount")[0];
        amtSpan.innerText = amount.toString();
        /** @type {HTMLButtonElement} */
        // @ts-ignore
        const playAgainButton =
          dialog.getElementsByClassName("play-again-button")[0];
        attachOnClickPlayAgainButton(playAgainButton);
        if (!isCurrentlyMuted()) {
          LOSE_SFX.play();
        }
      } else {
        dialog = spawnModal("error-dialog-template");
        /** @type {HTMLParagraphElement} */
        // @ts-ignore
        const errP = dialog.getElementsByClassName("flip-error-msg")[0];
        errP.innerText = result.toString();
      }
      /** @type {HTMLAnchorElement} */
      // @ts-ignore
      const explorerLink =
        dialog.getElementsByClassName("view-on-explorer-a")[0];
      explorerLink.href = toExplorerLink(reqKey);

      await sleep(DIALOG_SPAWN_CD_MS);
    }

    // remove expired flips
    const now = Date.now();
    removePendingFlips(
      wallet.account,
      getPendingFlips(wallet.account)
        .filter(({ expiration }) => expiration < now)
        .map(({ reqKey }) => reqKey)
    );

    if (getPendingFlips(wallet.account).length === 0) {
      break;
    }
    await sleep(POLL_FLIPS_INTERVAL_MS);
  }
  /* eslint-enable no-await-in-loop */
  STATE.isRunning = false;
}

function onPageParsed() {
  startPollFlipsLoop();
}

onPageParsed();
