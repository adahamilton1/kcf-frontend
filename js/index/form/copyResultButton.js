import { getResultTextArea } from "@/js/index/form/utils";
import { confirmViaDialog } from "@/js/index/utils";

function onPageParsed() {
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const copyBtn = document.getElementById("copy-result-button");
  copyBtn.onclick = async () => {
    const textarea = getResultTextArea();
    await window.navigator.clipboard.writeText(textarea.value);
    await confirmViaDialog("Result copied to clipboard!");
  };
}

onPageParsed();
