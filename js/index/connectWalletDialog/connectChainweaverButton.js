function openConnectChainweaverDialog() {
  /** @type {HTMLDialogElement} */
  // @ts-ignore
  const prevDialog = document.getElementById("connect-wallet-dialog");
  if (prevDialog.open) {
    prevDialog.close();
  }
  /** @type {HTMLDialogElement} */
  // @ts-ignore
  const dialog = document.getElementById("connect-chainweaver-dialog");
  dialog.showModal();
}

async function onPageParsed() {
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const btn = document.getElementById("connect-chainweaver-button");
  btn.onclick = openConnectChainweaverDialog;
}

onPageParsed();
