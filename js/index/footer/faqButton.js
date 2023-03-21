function onPageParsed() {
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const button = document.getElementById("faq-button");
  button.onclick = () => {
    /** @type {HTMLDialogElement} */
    // @ts-ignore
    const dialog = document.getElementById("faq-dialog");
    dialog.showModal();
  };
}

onPageParsed();
