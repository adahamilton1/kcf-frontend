import {
  getResultTextArea,
  hideLoadingShowCopy,
  parseForm,
  showLoadingHideCopy,
  updateResult,
} from "@/js/index/form/utils";
import { localTx } from "@/js/lib/kda/utils";

function onPageParsed() {
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const btn = document.getElementById("readonly-simulate-button");
  btn.onclick = async () => {
    showLoadingHideCopy();
    getResultTextArea().focus();
    let isError = false;
    let feedback = "";
    try {
      const { cmd, chainwebEndpoint } = parseForm();
      const tx = cmd.createCommand();
      /** @type {import("@kadena/types").ICommand} */
      // @ts-ignore
      const txCasted = tx;
      const resp = await localTx(chainwebEndpoint, txCasted);
      if (resp.result.status === "failure") {
        isError = true;
      }
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
