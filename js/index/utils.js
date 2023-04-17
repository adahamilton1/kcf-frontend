import { spawnModal } from "@/js/index/dialogs/dialogTemplates";

const CAP_INDEX_REGEXP = /^cap([0-9]+)$/;

function mkCapName(index) {
  return `cap${index}`;
}

function mkCapSignerName(index) {
  return `cap${index}Signer`;
}

/**
 *
 * @param {string} capX
 * @returns {number} X
 * @throws if capX not in correct format
 */
export function parseCapIndex(capX) {
  const match = capX.match(CAP_INDEX_REGEXP);
  if (match === null) {
    throw new Error("cap index regex unmatched");
  }
  return Number(match[1]);
}

const CAP_SIGNER_REGEXP = /^cap([0-9]+)Signer$/;

/**
 *
 * @param {string} capXSigner
 * @returns {number} X
 * @throws if capXSigner not in correct format
 */
export function parseCapSigner(capXSigner) {
  const match = capXSigner.match(CAP_SIGNER_REGEXP);
  if (match === null) {
    throw new Error("cap signer regex unmatched");
  }
  return Number(match[1]);
}

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
  container.appendChild(newCapDiv);
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
