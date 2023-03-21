import { rerenderImg } from "@/js/common/darkMode";
import { setupDialog } from "@/js/index/dialogs/listeners";

/**
 *
 * @param {string} templateId
 * @returns {HTMLDialogElement}
 */
export function spawnModal(templateId) {
  /** @type {HTMLTemplateElement} */
  // @ts-ignore
  const template = document.getElementById(templateId);
  /** @type {HTMLDialogElement} */
  // @ts-ignore
  const dialog = template.content.firstElementChild.cloneNode(true);
  setupDialog(dialog);
  document.body.appendChild(dialog);
  dialog.addEventListener("close", () => {
    document.body.removeChild(dialog);
  });
  dialog.querySelectorAll("img.close-dialog-button-img").forEach(rerenderImg);
  dialog.showModal();
  return dialog;
}
