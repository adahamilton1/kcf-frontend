import { connectWallet } from "@/js/common/connectedWallet";
import { ChainweaverQuickSignWallet } from "@/js/lib/kda/walletAdapter/chainweaverQuickSignWallet";
import { onWalletChanged } from "@/js/index/onWallet";
import { NotKAccountError } from "@/js/lib/kda/walletAdapter/chainweaverWallet";

/**
 *
 * @param {SubmitEvent} event
 */
async function onSubmit(event) {
  event.preventDefault();
  /** @type {HTMLInputElement} */
  // @ts-ignore
  const input = document.getElementById("chainweaver-address-input");
  const account = input.value;
  try {
    await connectWallet(ChainweaverQuickSignWallet, { account });
    onWalletChanged();
    /** @type {HTMLDialogElement} */
    // @ts-ignore
    const connectChainweaverDialog = document.getElementById(
      "connect-chainweaver-dialog"
    );
    if (connectChainweaverDialog.open) {
      connectChainweaverDialog.close();
    }
  } catch (e) {
    // TODO: I18N errmsg
    let errMsg = e.toString();
    if (e instanceof NotKAccountError) {
      errMsg = "Sorry, we currently only support 'k:' accounts";
    }
    input.setCustomValidity(errMsg);
    /** @type {HTMLParagraphElement} */
    // @ts-ignore
    const errmsgPara = document.getElementById(
      "chainweaver-address-input-errmsg"
    );
    errmsgPara.innerText = errMsg;
  }
}

function onPageParsed() {
  /** @type {HTMLFormElement} */
  // @ts-ignore
  const form = document.getElementById("connect-chainweaver-form");
  form.onsubmit = onSubmit;
  /** @type {HTMLInputElement} */
  // @ts-ignore
  const input = document.getElementById("chainweaver-address-input");
  input.onchange = () => {
    // reset validity
    input.setCustomValidity("");
  };
}

onPageParsed();
