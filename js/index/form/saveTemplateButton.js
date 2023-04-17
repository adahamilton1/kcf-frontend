import { spawnModal } from "@/js/index/dialogs/dialogTemplates";
import {
  formValToGetParams,
  getResultTextArea,
  loadAndRenderFormTemplates,
  parseForm,
  saveFormTemplate,
  updateResult,
} from "@/js/index/form/utils";

function onPageParsed() {
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const saveTemplateButton = document.getElementById("save-template-button");
  saveTemplateButton.onclick = () => {
    const dialog = spawnModal("save-form-template-dialog-template");
    /** @type {HTMLInputElement} */
    // @ts-ignore
    const input = dialog.querySelector("input");
    /** @type {HTMLButtonElement} */
    // @ts-ignore
    const submitButton = dialog.querySelector("button.flip-button-submit");
    submitButton.onclick = () => {
      try {
        const formVal = parseForm();
        const urlSearchParams = formValToGetParams(formVal);
        saveFormTemplate(input.value, urlSearchParams);
        loadAndRenderFormTemplates();
      } catch (e) {
        updateResult(e.message, true);
        getResultTextArea().focus();
      } finally {
        dialog.close();
      }
    };
  };
}

onPageParsed();
