import { attachOnClick as attachOnClickConnectWallet } from "@/js/index/header/walletInfoDiv/connectWalletButton";
import { attachOnClick as attachOnClickWalletButton } from "@/js/index/header/walletInfoDiv/walletConnectedDiv/walletButton";
import { attachOnClick as attachOnClickWalletDisconnectButton } from "@/js/index/header/walletInfoDiv/walletConnectedDiv/walletDisconnectButton";

function onPageParsed() {
  attachOnClickConnectWallet();
  attachOnClickWalletButton();
  attachOnClickWalletDisconnectButton();
}

onPageParsed();
