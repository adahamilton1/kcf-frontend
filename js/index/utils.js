import { spawnModal } from "@/js/index/dialogs/dialogTemplates";

const CAP_INDEX_REGEXP = /^cap([0-9]+)$/;

function mkCapName(index) {
  return `cap${index}`;
}

function mkCapSignerName(index) {
  return `cap${index}Signer`;
}

function mkCapArg(capIndex, argIndex) {
  return `cap${capIndex}Arg${argIndex}`;
}

/**
 *
 * @param {string} capX
 * @returns {RegExpMatchArray | null}
 */
export function matchCapIndex(capX) {
  return capX.match(CAP_INDEX_REGEXP);
}

/**
 *
 * @param {string} capX
 * @returns {number} X
 * @throws if capX not in correct format
 */
export function parseCapIndex(capX) {
  const match = matchCapIndex(capX);
  if (match === null) {
    throw new Error("cap index regex unmatched");
  }
  return Number(match[1]);
}

const CAP_SIGNER_REGEXP = /^cap([0-9]+)Signer$/;

/**
 *
 * @param {string} capXSigner
 * @returns {RegExpMatchArray | null}
 */
export function matchCapSigner(capXSigner) {
  return capXSigner.match(CAP_SIGNER_REGEXP);
}

/**
 *
 * @param {string} capXSigner
 * @returns {number} X
 * @throws if capXSigner not in correct format
 */
export function parseCapSigner(capXSigner) {
  const match = matchCapSigner(capXSigner);
  if (match === null) {
    throw new Error("cap signer regex unmatched");
  }
  return Number(match[1]);
}

const CAP_ARG_REGEXP = /^cap([0-9]+)Arg([0-9]+)$/;

/**
 *
 * @param {string} capXArgXY
 * @returns {RegExpMatchArray | null}
 */
export function matchCapArg(capXArgXY) {
  return capXArgXY.match(CAP_ARG_REGEXP);
}

/**
 *
 * @param {string} capXArgXY
 * @returns {{ capIndex: number; argIndex: number }}
 * @throws if capXArgXY not in correct format
 */
export function parseCapArg(capXArgXY) {
  const match = matchCapArg(capXArgXY);
  if (match === null) {
    throw new Error("cap signer regex unmatched");
  }
  return { capIndex: Number(match[1]), argIndex: Number(match[2]) };
}

/**
 * @returns {HTMLDivElement}
 */
export function addCap() {
  /** @type {HTMLDivElement} */
  // @ts-ignore
  const container = document.getElementById("cap-container");
  const lastCap = container.lastElementChild;
  let index = 0;
  if (lastCap) {
    /** @type {HTMLInputElement} */
    // @ts-ignore
    const inp = lastCap.querySelector(".cap-input");
    index = parseCapIndex(inp.name) + 1;
  }
  /** @type {HTMLTemplateElement} */
  // @ts-ignore
  const template = document.getElementById("cap-template");
  /** @type {HTMLDivElement} */
  // @ts-ignore
  const newCapDiv = template.content.firstElementChild.cloneNode(true);
  /** @type {HTMLInputElement} */
  // @ts-ignore
  const capInput = newCapDiv.querySelector(".cap-input");
  capInput.name = mkCapName(index);
  /** @type {HTMLInputElement} */
  // @ts-ignore
  const capSignerInput = newCapDiv.querySelector(".cap-signer-input");
  capSignerInput.name = mkCapSignerName(index);
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const closeBtn = newCapDiv.querySelector(`button[aria-label="close"]`);
  closeBtn.onclick = () => {
    confirmViaDialog("Remove cap?").then((isConfirmed) => {
      if (isConfirmed) {
        container.removeChild(newCapDiv);
      }
    });
  };
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const addCapArgButton = newCapDiv.querySelector(`button.add-cap-arg-button`);
  addCapArgButton.onclick = () => addCapArg(newCapDiv, index);

  container.appendChild(newCapDiv);
  return newCapDiv;
}

/**
 *
 * @param {HTMLDivElement} capDiv
 * @param {number} capIndex
 * @returns {HTMLDivElement}
 */
export function addCapArg(capDiv, capIndex) {
  /** @type {HTMLFieldSetElement} */
  // @ts-ignore
  const fieldset = capDiv.querySelector("fieldset");
  const lastArg = fieldset.lastElementChild;
  let argIndex = 0;
  if (lastArg && lastArg.classList.contains("cap-arg-row")) {
    /** @type {HTMLInputElement} */
    // @ts-ignore
    const inp = lastArg.querySelector(".cap-arg-input");
    argIndex = parseCapArg(inp.name).argIndex + 1;
  }
  /** @type {HTMLTemplateElement} */
  // @ts-ignore
  const template = document.getElementById("cap-arg-template");
  /** @type {HTMLDivElement} */
  // @ts-ignore
  const newArgRow = template.content.firstElementChild.cloneNode(true);
  /** @type {HTMLInputElement} */
  // @ts-ignore
  const capInput = newArgRow.querySelector("input");
  capInput.name = mkCapArg(capIndex, argIndex);
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const closeBtn = newArgRow.querySelector(`button[aria-label="close"]`);
  closeBtn.onclick = () => {
    fieldset.removeChild(newArgRow);
  };

  fieldset.appendChild(newArgRow);
  return newArgRow;
}

/**
 *
 * @param {string} msg
 * @returns {Promise<boolean>}
 */
export async function confirmViaDialog(msg) {
  const dialog = spawnModal("confirm-dialog-template");
  /** @type {HTMLHeadingElement} */
  // @ts-ignore
  const h2 = dialog.querySelector("h2");
  h2.innerText = msg;
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const confirmBtn = dialog.querySelector("button.flip-button-submit");
  return new Promise((resolve) => {
    const resolveFalseFn = () => resolve(false);
    dialog.addEventListener("close", resolveFalseFn);
    dialog.onclose = () => resolve(false);
    confirmBtn.onclick = () => {
      dialog.removeEventListener("close", resolveFalseFn);
      dialog.close();
      resolve(true);
    };
  });
}
