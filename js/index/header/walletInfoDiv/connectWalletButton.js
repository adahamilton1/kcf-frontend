export function attachOnClick() {
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const btn = document.getElementById("connect-wallet-button");
  btn.onclick = () => {
    /** @type {HTMLDialogElement} */
    // @ts-ignore
    const dialog = document.getElementById("connect-wallet-dialog");
    dialog.showModal();
  };
}
