import { HIDDEN_CLASS_NAME } from "@/js/common/consts";

/**
 *
 * @param {MouseEvent} event
 */
function hideDropdownRemoveListener(event) {
  // ignore initial click
  if (
    event.target &&
    // @ts-ignore
    event.target.id === "wallet-button"
  ) {
    return;
  }
  /** @type {HTMLUListElement} */
  // @ts-ignore
  const ul = document.getElementById("wallet-button-dropdown");
  if (!ul.classList.contains(HIDDEN_CLASS_NAME)) {
    ul.classList.add(HIDDEN_CLASS_NAME);
  }
  window.removeEventListener("click", hideDropdownRemoveListener);
}

export function attachOnClick() {
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const btn = document.getElementById("wallet-button");
  btn.onclick = () => {
    /** @type {HTMLUListElement} */
    // @ts-ignore
    const ul = document.getElementById("wallet-button-dropdown");
    if (ul.classList.contains(HIDDEN_CLASS_NAME)) {
      ul.classList.remove(HIDDEN_CLASS_NAME);
      // NB: this will result in any buttons in the dropdown closing on click too
      window.addEventListener("click", hideDropdownRemoveListener);
    }
  };
}
