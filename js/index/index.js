import { defineCustomElement as defineChainweaverConnectButton } from "@kcf/kda-wallet-chainweaver-connect-button";
import { defineCustomElement as defineEckoWalletConnectButton } from "@kcf/kda-wallet-eckowallet-connect-button";
import { defineCustomElement as defineConnectDialog } from "@kcf/kda-wallet-connect-dialog";
import { defineCustomElement as defineWalletconnectConnectButton } from "@kcf/kda-wallet-walletconnect-connect-button";
import { defineCustomElement as defineZelcoreConnectButton } from "@kcf/kda-wallet-zelcore-connect-button";

function onPageParsed() {
  defineChainweaverConnectButton();
  defineEckoWalletConnectButton();
  defineWalletconnectConnectButton();
  defineZelcoreConnectButton();
  defineConnectDialog();
}

onPageParsed();
