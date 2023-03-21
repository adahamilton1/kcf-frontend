export const FLIP_BUTTON_SELECTED_CLASSNAME = "flip-button-selected";

/**
 * Creates the MutationCallback to set the correct selected button for a given dataAttrName
 * @param {string} dataAttrName
 * @returns {MutationCallback}
 */
export function onDataChangedGen(dataAttrName) {
  return (mutationList) => {
    mutationList.forEach(({ attributeName, target }) => {
      if (attributeName !== dataAttrName) {
        return;
      }
      // @ts-ignore
      setSelectedClassForButtons(target, dataAttrName);
    });
  };
}

/**
 * Sets the selected class on the correct
 * button when the given data attribute changes
 * @param {HTMLFieldSetElement} fieldset
 * @param {string} dataAttrName
 */
export function setSelectedClassForButtons(fieldset, dataAttrName) {
  const value = fieldset.getAttribute(dataAttrName);
  if (value === null) {
    throw new Error(`${dataAttrName} value is null`);
  }
  const innerButtons = fieldset.querySelectorAll("button");
  innerButtons.forEach((button) => {
    if (button.value === value) {
      button.classList.add(FLIP_BUTTON_SELECTED_CLASSNAME);
    } else {
      button.classList.remove(FLIP_BUTTON_SELECTED_CLASSNAME);
    }
  });
}

/**
 *
 * Creates the onclick callback that sets the parent data-attr value
 * to the button's value
 * @param {string} dataAttrName
 * @returns {(this: HTMLButtonElement, event: MouseEvent) => void}
 */
export function onClickGen(dataAttrName) {
  return (event) => {
    /** @type {HTMLButtonElement} */
    // @ts-ignore
    const button = event.target;
    const fieldset = button.closest("fieldset");
    if (!fieldset) {
      throw new Error("parent fieldset not found");
    }
    fieldset.setAttribute(dataAttrName, button.value);
  };
}
