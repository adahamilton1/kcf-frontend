import {
  formValToGetParams,
  getResultTextArea,
  parseForm,
  updateResult,
} from "@/js/index/form/utils";
import { confirmViaDialog } from "@/js/index/utils";

function onPageParsed() {
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const shareButton = document.getElementById("share-button");
  shareButton.onclick = async () => {
    try {
      const formVal = parseForm();
      const getParams = formValToGetParams(formVal);
      window.navigator.clipboard.writeText(
        `${window.location.origin}?${getParams.toString()}`
      );
      await confirmViaDialog("URL written to clipboard!");
    } catch (e) {
      updateResult(e.message, true);
      getResultTextArea().focus();
    }
  };
}

onPageParsed();
