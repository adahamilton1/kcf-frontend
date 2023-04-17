import { addCap } from "@/js/index/utils";

function onPageParsed() {
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const btn = document.getElementById("add-cap-button");
  btn.onclick = addCap;
}

onPageParsed();
