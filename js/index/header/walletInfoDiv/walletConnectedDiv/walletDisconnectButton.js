// import { disconnectWallet } from "@/js/common/connectedWallet";
import { getConnectWalletDialog } from "@/js/index/connectWalletDialog";

export function attachOnClick() {
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const btn = document.getElementById("wallet-disconnect-button");
  btn.onclick = () => {
    getConnectWalletDialog().disconnect();
  };
}
