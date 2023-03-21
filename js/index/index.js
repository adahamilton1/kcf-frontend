import { tryLoadConnectedWallet } from "@/js/common/connectedWallet";
import { onWalletChanged } from "@/js/index/onWallet";

function onPageParsed() {
  tryLoadConnectedWallet().then(onWalletChanged);
}

onPageParsed();
