export function attachOnClick() {
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const btn = document.getElementById("connect-wallet-button");
  btn.onclick = () => {
    /** @type {import("@kcf/kda-wallet-connect-dialog").KdaWalletConnectDialog} */
    // @ts-ignore
    const dialog = document.querySelector("kda-wallet-connect-dialog");
    dialog.showModal();
  };
}
