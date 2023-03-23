import { connectWallet } from "@/js/common/connectedWallet";
import { ATTR_ONLY_OBSERVER_OPTIONS } from "@/js/common/consts";
import { ChainweaverWallet } from "@/js/lib/kda/walletAdapter/chainweaverWallet";
import { EckoWallet } from "@/js/lib/kda/walletAdapter/eckoWallet";
import { onWalletChanged } from "@/js/index/onWallet";
import { spawnModal } from "@/js/index/dialogs/dialogTemplates";

const ID = "connect-wallet-dialog";

/**
 * @type {Record<string, typeof import("@/js/lib/kda/walletAdapter/walletAdapter").WalletAdapter>}
 */
const BUTTON_ID_TO_WALLET = {
  "connect-chainweaver-button": ChainweaverWallet,
  "connect-eckowallet-button": EckoWallet,
};

async function checkWalletsIsInstalled() {
  await Promise.all(
    Object.entries(BUTTON_ID_TO_WALLET).map(async ([id, cls]) => {
      const isInstalled = await cls.isInstalled();
      /** @type {HTMLButtonElement} */
      // @ts-ignore
      const btn = document.getElementById(id);
      if (isInstalled) {
        btn.removeAttribute("disabled");
      } else {
        btn.setAttribute("disabled", "1");
      }
    })
  );
}

/**
 *
 * @type {MutationCallback}
 */
function onDialogMutate(mutationRecords) {
  mutationRecords.forEach(({ attributeName, target }) => {
    /** @type {HTMLDialogElement} */
    // @ts-ignore
    const dialog = target;
    if (attributeName === "open" && dialog.open) {
      checkWalletsIsInstalled();
    }
  });
}

/**
 *
 * @param {typeof import("@/js/lib/kda/walletAdapter/walletAdapter").WalletAdapter} cls
 */
async function simpleConnectWallet(cls) {
  try {
    await connectWallet(cls, {});
    onWalletChanged();
  } catch (e) {
    const errDialog = spawnModal("error-dialog-template");
    /** @type {HTMLParagraphElement} */
    // @ts-ignore
    const errP = errDialog.getElementsByClassName("flip-error-msg")[0];
    errP.innerText = e.message ?? JSON.stringify(e);
    /** @type {HTMLAnchorElement} */
    // @ts-ignore
    const viewOnExplorerLink =
      errDialog.getElementsByClassName("view-on-explorer-a")[0];
    viewOnExplorerLink.classList.add("hidden");
  } finally {
    /** @type {HTMLDialogElement} */
    // @ts-ignore
    const connectWalletDialog = document.getElementById(ID);
    if (connectWalletDialog.open) {
      connectWalletDialog.close();
    }
  }
}

function onPageParsed() {
  /** @type {HTMLDialogElement} */
  // @ts-ignore
  const dialog = document.getElementById(ID);
  new MutationObserver(onDialogMutate).observe(
    dialog,
    ATTR_ONLY_OBSERVER_OPTIONS
  );

  for (const [btnId, cls] of Object.entries(BUTTON_ID_TO_WALLET)) {
    /** @type {HTMLButtonElement} */
    // @ts-ignore
    const btn = document.getElementById(btnId);
    if (cls !== ChainweaverWallet) {
      btn.onclick = () => simpleConnectWallet(cls);
    }
  }
}

onPageParsed();
