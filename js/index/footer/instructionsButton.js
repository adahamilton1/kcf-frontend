function onPageParsed() {
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const button = document.getElementById("instructions-button");
  button.onclick = () => {
    /** @type {HTMLDialogElement} */
    // @ts-ignore
    const dialog = document.getElementById("instructions-dialog");
    dialog.showModal();
  };
}

onPageParsed();
