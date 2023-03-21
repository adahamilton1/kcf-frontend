/**
 *
 * @param {HTMLButtonElement} button
 */
export function attachOnClick(button) {
  button.onclick = () => {
    /** @type {HTMLDialogElement} */
    // @ts-ignore
    const dialog = button.closest("dialog");
    dialog.close();
    /** @type {HTMLFormElement} */
    // @ts-ignore
    const form = document.getElementById("flip-form");
    // need cancelable: true or e.preventDefault() doesnt work
    form.dispatchEvent(new Event("submit", { cancelable: true }));
  };
}
