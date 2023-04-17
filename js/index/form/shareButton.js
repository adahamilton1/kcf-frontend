import { formValToGetParams, parseForm } from "@/js/index/form/utils";
import { confirmViaDialog } from "@/js/index/utils";

function onPageParsed() {
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const shareButton = document.getElementById("share-button");
  shareButton.onclick = async () => {
    const formVal = parseForm();
    const getParams = formValToGetParams(formVal);
    window.navigator.clipboard.writeText(
      `${window.location.origin}?${getParams.toString()}`
    );
    await confirmViaDialog("URL written to clipboard!");
  };
}

onPageParsed();
