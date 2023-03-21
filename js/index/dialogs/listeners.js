import { ATTR_ONLY_OBSERVER_OPTIONS } from "@/js/common/consts";

const MUTATION_OBSERVER = new MutationObserver(onDialogAttrMutation);

/**
 *
 * @param {HTMLDialogElement} dialog
 */
export function setupDialog(dialog) {
  MUTATION_OBSERVER.observe(dialog, ATTR_ONLY_OBSERVER_OPTIONS);
}

/**
 *
 * @param {MutationRecord[]} mutationRecords
 */
function onDialogAttrMutation(mutationRecords) {
  for (const record of mutationRecords) {
    if (record.attributeName && record.attributeName === "open") {
      /** @type {HTMLDialogElement} */
      // @ts-ignore
      const dialog = record.target;
      if (dialog.open) {
        onOpen(dialog);
      }
    }
  }
}

/**
 *
 * @param {HTMLDialogElement} dialog
 */
function onOpen(dialog) {
  const clickToCloseWindowListener = createClickToCloseWindowListener(dialog);
  window.addEventListener("click", clickToCloseWindowListener);
  dialog.querySelectorAll("img.close-dialog-button-img").forEach((img) => {
    const parentButton = img.parentElement;
    if (!parentButton) {
      throw new Error(`img ${img} has no containing button`);
    }
    parentButton.onclick = closeButtonOnClickListener;
  });
  dialog.onclose = createOnCloseListener(clickToCloseWindowListener);
}

/**
 *
 * @param {(e: MouseEvent) => void} clickToCloseWindowListener
 * @returns {() => void}
 */
function createOnCloseListener(clickToCloseWindowListener) {
  return () => {
    window.removeEventListener("click", clickToCloseWindowListener);
  };
}

/**
 *
 * @param {HTMLDialogElement} dialog
 * @returns {(e: MouseEvent) => void}
 */
function createClickToCloseWindowListener(dialog) {
  return (event) => {
    if (event.target && event.target === dialog) {
      dialog.close();
    }
  };
}

/**
 *
 * @param {MouseEvent} event
 */
function closeButtonOnClickListener(event) {
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const button = event.target;
  const parentDialog = button.closest("dialog");
  if (!parentDialog) {
    throw new Error(`button ${button} has no containing dialog`);
  }
  parentDialog.close();
}
