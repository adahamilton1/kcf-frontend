import { defineCustomElement as defineChainweaverConnectButton } from "@kcf/kda-wallet-chainweaver-connect-button";
import { defineCustomElement as defineEckoWalletConnectButton } from "@kcf/kda-wallet-eckowallet-connect-button";
import { defineCustomElement as defineConnectDialog } from "@kcf/kda-wallet-connect-dialog";
import { defineCustomElement as defineWalletconnectConnectButton } from "@kcf/kda-wallet-walletconnect-connect-button";
import { defineCustomElement as defineWalletconnectConnectButtonV2 } from "@kcf/kda-wallet-walletconnect-connect-button-v2";
import { defineCustomElement as defineZelcoreConnectButton } from "@kcf/kda-wallet-zelcore-connect-button";

function onPageParsed() {
  defineChainweaverConnectButton();
  defineEckoWalletConnectButton();
  defineWalletconnectConnectButton();
  defineWalletconnectConnectButtonV2(
    "kda-wallet-walletconnect-connect-button-v2"
  );
  defineZelcoreConnectButton();
  defineConnectDialog();
  document
    .querySelectorAll("kda-wallet-walletconnect-connect-button > button")
    .forEach((/** @type {HTMLButtonElement} */ btn) => {
      btn.innerText = "WalletConnect (eckoWALLET)";
    });
}

onPageParsed();
