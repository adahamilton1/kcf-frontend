import {
  getResultTextArea,
  hideLoadingShowCopy,
  parseForm,
  showLoadingHideCopy,
  updateResult,
} from "@/js/index/form/utils";
import { sendTx } from "@/js/lib/kda/utils";
import { getConnectWalletDialog } from "@/js/index/connectWalletDialog";
import { NoWalletConnectedError } from "@/js/common/errs";

function onPageParsed() {
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const btn = document.getElementById("sign-send-button");
  btn.onclick = async () => {
    showLoadingHideCopy();
    getResultTextArea().focus();
    let isError = false;
    let feedback = "";
    try {
      const { cmd, chainwebEndpoint } = parseForm();
      const wallet = getConnectWalletDialog().connectedWallet;
      if (!wallet) {
        throw new NoWalletConnectedError();
      }
      const tx = await wallet.signCmd(cmd);
      const resp = await sendTx(chainwebEndpoint, tx);
      feedback = JSON.stringify(resp, undefined, 2);
    } catch (e) {
      /** @type {Error} */
      const err = e;
      feedback = err.message;
      isError = true;
    }
    updateResult(feedback, isError);
    hideLoadingShowCopy();
  };
}

onPageParsed();
