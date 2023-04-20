function onPageParsed() {
  /** @type {HTMLSelectElement} */
  // @ts-ignore
  const select = document.querySelector(`select[name="networkId"]`);
  select.onchange = () => {
    const newNetworkId = select.value;
    const walletBtns = document.querySelectorAll(
      `kda-wallet-eckowallet-connect-button, kda-wallet-walletconnect-connect-button, kda-wallet-walletconnect-connect-button-v2`
    );
    for (const walletBtn of walletBtns) {
      const oldNetworkId = walletBtn.getAttribute("network-id");
      if (oldNetworkId !== newNetworkId) {
        walletBtn.setAttribute("network-id", newNetworkId);
      }
    }
  };
}

onPageParsed();
