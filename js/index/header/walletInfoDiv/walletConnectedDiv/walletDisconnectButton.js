import { disconnectWallet } from "@/js/common/connectedWallet";
import { onWalletChanged } from "@/js/index/onWallet";

export function attachOnClick() {
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const btn = document.getElementById("wallet-disconnect-button");
  btn.onclick = () => {
    disconnectWallet();
    onWalletChanged();
  };
}
