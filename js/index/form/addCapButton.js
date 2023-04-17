import { addCap } from "@/js/index/utils";

function onPageParsed() {
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const btn = document.getElementById("add-cap-button");
  btn.onclick = () => {
    const newCapDiv = addCap();
    /** @type {HTMLInputElement} */
    // @ts-ignore
    const capInput = newCapDiv.querySelector(".cap-input");
    capInput.focus();
  };
}

onPageParsed();
