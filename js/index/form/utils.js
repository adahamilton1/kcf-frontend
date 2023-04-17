import { defaultChainwebEndpoint } from "@/js/lib/kda/utils";
import { PactCommand } from "@kadena/client";
import {
  addCap,
  addCapArg,
  confirmViaDialog,
  matchCapArg,
  matchCapIndex,
  matchCapSigner,
  parseCapArg,
  parseCapIndex,
  parseCapSigner,
} from "@/js/index/utils";

/**
 * @typedef {{
 *  signer: string;
 *  cap: string;
 *  args: Map<number, string>;
 * }} CapVal
 */

/**
 * @typedef {{
 *  cmd: PactCommand;
 *  chainwebEndpoint: string;
 * }} FormVal
 */

/**
 * @returns {FormVal}
 * @throws any form validation errors or if wallet not connected and there are caps present
 */
export function parseForm() {
  /** @type {HTMLFormElement} */
  // @ts-ignore
  const form = document.getElementById("tx-form");
  const formData = new FormData(form);
  const cmd = new PactCommand();
  /** @type {Map<number, CapVal>} */
  const capMap = new Map();
  let chainwebEndpoint = "";
  // have to set networkId last because setMeta overwrites
  // networkId if not provided
  let networkId = "mainnet01";
  for (const [name, strValue] of formData) {
    /** @type {number} */
    let gasLimit;
    /** @type {number} */
    let gasPrice;
    /** @type {number} */
    let ttl;
    /** @type {?RegExpMatchArray} */
    let maybeMatchCapSigner;
    /** @type {?RegExpMatchArray} */
    let maybeMatchCapIndex;
    /** @type {?RegExpMatchArray} */
    let maybeMatchCapArg;
    /** @type {number} */
    let capIndex;
    /** @type {number} */
    let argIndex;
    /** @type {CapVal | undefined} */
    let capMapRecord;
    switch (name) {
      case "chainwebEndpoint":
        chainwebEndpoint = strValue.toString();
        break;
      case "networkId":
        networkId = strValue.toString();
        break;
      case "chainId":
        // @ts-ignore
        cmd.setMeta({ chainId: strValue.toString() });
        break;
      case "gasLimit":
        gasLimit = Number(strValue);
        if (!Number.isInteger(gasLimit) || gasLimit <= 0) {
          throw new Error(
            `invalid gasLimit ${strValue}. Must be positive integer.`
          );
        }
        cmd.setMeta({ gasLimit });
        break;
      case "gasPrice":
        gasPrice = Number(strValue);
        if (Number.isNaN(gasPrice) || gasPrice <= 0) {
          throw new Error(
            `invalid gasPrice ${gasPrice}. Must be positive number.`
          );
        }
        cmd.setMeta({ gasPrice });
        break;
      case "ttl":
        ttl = Number(strValue);
        if (!Number.isInteger(ttl) || ttl <= 0) {
          throw new Error(`invalid ttl ${strValue}. Must be positive integer.`);
        }
        cmd.setMeta({ ttl });
        break;
      case "sender":
        cmd.setMeta({ sender: strValue.toString() });
        break;
      case "code":
        cmd.code = strValue.toString();
        break;
      case "data":
        if (strValue) {
          cmd.addData(JSON.parse(strValue.toString()));
        }
        break;
      default:
        maybeMatchCapSigner = matchCapSigner(name);
        maybeMatchCapIndex = matchCapIndex(name);
        maybeMatchCapArg = matchCapArg(name);
        if (
          maybeMatchCapIndex === null &&
          maybeMatchCapIndex === null &&
          maybeMatchCapArg === null
        ) {
          break;
        }
        if (maybeMatchCapIndex !== null) {
          capIndex = parseCapIndex(name);
        } else if (maybeMatchCapSigner !== null) {
          capIndex = parseCapSigner(name);
        } else {
          const capArg = parseCapArg(name);
          capIndex = capArg.capIndex;
          argIndex = capArg.argIndex;
        }
        capMapRecord = capMap.get(capIndex);
        if (capMapRecord === undefined) {
          capMapRecord = { signer: "", cap: "", args: new Map() };
        }
        if (maybeMatchCapIndex !== null) {
          capMapRecord.cap = strValue.toString();
        } else if (maybeMatchCapSigner !== null) {
          capMapRecord.signer = strValue.toString();
        } else {
          // @ts-ignore
          capMapRecord.args.set(argIndex, strValue.toString());
        }
        capMap.set(capIndex, capMapRecord);
        break;
    }
  }
  // TODO: fix dep cycle from using getConnectWalletDialog()
  /** @type {import("@kcf/kda-wallet-connect-dialog").KdaWalletConnectDialog} */
  // @ts-ignore
  const dialog = document.querySelector("kda-wallet-connect-dialog");
  const { connectedWallet } = dialog;
  if (capMap.size > 0) {
    const pubKey = connectedWallet ? connectedWallet.accounts[0].pubKey : "";
    for (const { signer, cap, args } of capMap.values()) {
      parseAndAddCap(cmd, cap, args, signer, pubKey);
    }
  }
  if (connectedWallet && !cmd.publicMeta.sender) {
    cmd.setMeta({ sender: connectedWallet.accounts[0].account });
  }
  // @ts-ignore
  cmd.setMeta({}, networkId);
  if (!chainwebEndpoint) {
    chainwebEndpoint = defaultChainwebEndpoint(cmd.networkId);
  }
  return {
    cmd,
    chainwebEndpoint,
  };
}

/**
 * @param {PactCommand} cmd
 * @param {string} capStr
 * @param {Map<number, string>} args
 * @param {string} signerOption blank if not filled up
 * @param {string} defaultSigner
 */
function parseAndAddCap(cmd, capStr, args, signerOption, defaultSigner) {
  const signer = signerOption || defaultSigner;
  const argsSorted = [...args.entries()].sort(([k1], [k2]) => k1 - k2);
  const argsParsed = argsSorted.map(([, v]) => {
    try {
      return JSON.parse(v);
    } catch {
      return v;
    }
  });
  cmd.addCap(capStr, signer, ...argsParsed);
}

/** @returns {HTMLTextAreaElement} */
export function getResultTextArea() {
  // @ts-ignore
  return document.getElementById("result-textarea");
}

/**
 *
 * @param {string} msg
 * @param {boolean} isError
 */
export function updateResult(msg, isError) {
  const textarea = getResultTextArea();
  if (isError) {
    textarea.classList.add("text-failure");
  } else {
    textarea.classList.remove("text-failure");
  }
  textarea.value = msg;
}

export function showLoadingHideCopy() {
  /** @type {HTMLImageElement} */
  // @ts-ignore
  const loadingImg = document.getElementById("result-loading-spinner");
  loadingImg.classList.remove("hidden");
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const copyBtn = document.getElementById("copy-result-button");
  copyBtn.classList.add("hidden");
}

export function hideLoadingShowCopy() {
  /** @type {HTMLImageElement} */
  // @ts-ignore
  const loadingImg = document.getElementById("result-loading-spinner");
  loadingImg.classList.add("hidden");
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const copyBtn = document.getElementById("copy-result-button");
  copyBtn.classList.remove("hidden");
}

/**
 * @param {FormVal} formVal
 * @returns {URLSearchParams}
 */
export function formValToGetParams({ chainwebEndpoint, cmd }) {
  const {
    publicMeta: { chainId, sender, gasLimit, gasPrice, ttl },
    networkId,
    signers,
    code,
    data,
  } = cmd;
  const res = new URLSearchParams();
  res.append("chainwebEndpoint", encodeURIComponent(chainwebEndpoint));
  res.append("networkId", networkId);
  res.append("chainId", chainId);
  res.append("gasLimit", gasLimit.toString());
  res.append("gasPrice", gasPrice.toString());
  res.append("ttl", ttl.toString());
  res.append("sender", encodeURIComponent(sender));
  res.append("signers", encodeURIComponent(JSON.stringify(signers)));
  res.append("code", encodeURIComponent(code));
  res.append("data", encodeURIComponent(JSON.stringify(data)));
  return res;
}

/**
 *
 * @param {string} keyName
 * @param {URLSearchParams} urlSearchParams
 */
function updateInputValue(keyName, urlSearchParams) {
  /** @type {HTMLInputElement} */
  // @ts-ignore
  const input = document.querySelector(`[name="${keyName}"]`);
  const saved = urlSearchParams.get(keyName);
  if (saved !== null) {
    input.value = decodeURIComponent(saved);
  }
}

/**
 *
 * @param {string} keyName
 * @param {URLSearchParams} urlSearchParams
 */
function updateSelectValue(keyName, urlSearchParams) {
  /** @type {HTMLSelectElement} */
  // @ts-ignore
  const input = document.querySelector(`[name="${keyName}"]`);
  const saved = urlSearchParams.get(keyName);
  if (saved === null) {
    return;
  }
  for (const optionRaw of input.children) {
    /** @type {HTMLOptionElement} */
    // @ts-ignore
    const option = optionRaw;
    if (option.value === saved) {
      if (!option.hasAttribute("selected")) {
        option.setAttribute("selected", "1");
      }
    } else if (option.hasAttribute("selected")) {
      option.removeAttribute("selected");
    }
  }
}

/**
 *
 * @param {import("@kadena/client").IPactCommand["signers"]} signers
 */
function recreateCaps(signers) {
  /** @type {HTMLDivElement} */
  // @ts-ignore
  const capContainer = document.getElementById("cap-container");
  capContainer.innerHTML = "";
  let capIndex = 0;
  for (const { pubKey, caps } of signers) {
    for (const { name, args } of caps) {
      const capDiv = addCap();
      /** @type {HTMLInputElement} */
      // @ts-ignore
      const nameInp = capDiv.querySelector(".cap-input");
      nameInp.value = name;
      /** @type {HTMLInputElement} */
      // @ts-ignore
      const signerInp = capDiv.querySelector(".cap-signer-input");
      signerInp.value = pubKey;
      for (const arg of args) {
        const argDiv = addCapArg(capDiv, capIndex);
        /** @type {HTMLInputElement} */
        // @ts-ignore
        const argInp = argDiv.querySelector("input");
        if (typeof arg === "object") {
          argInp.value = JSON.stringify(arg);
        } else {
          argInp.value = arg.toString();
        }
      }

      capIndex += 1;
    }
  }
}

/**
 *
 * @param {URLSearchParams} urlSearchParams
 */
export function parseGetParamsUpdateForm(urlSearchParams) {
  updateInputValue("chainwebEndpoint", urlSearchParams);
  updateSelectValue("networkId", urlSearchParams);
  updateSelectValue("chainId", urlSearchParams);
  updateInputValue("gasLimit", urlSearchParams);
  updateInputValue("gasPrice", urlSearchParams);
  updateInputValue("ttl", urlSearchParams);
  updateInputValue("sender", urlSearchParams);
  updateInputValue("code", urlSearchParams);
  updateInputValue("data", urlSearchParams);
  const maybeSignersStr = urlSearchParams.get("signers");
  if (maybeSignersStr) {
    /** @type {import("@kadena/client").IPactCommand["signers"]} */
    const signers = JSON.parse(decodeURIComponent(maybeSignersStr));
    recreateCaps(signers);
  }
}

const FORM_TEMPLATES_LOCALSTORAGE_KEY = "savedPactTemplates";

/**
 * @typedef {{
 *  name: string;
 *  urlSearchParams: string;
 * }} SaveFormTemplate
 */

/**
 * @returns {SaveFormTemplate[]}
 */
export function loadFormTemplates() {
  const curr = window.localStorage.getItem(FORM_TEMPLATES_LOCALSTORAGE_KEY);
  if (curr === null) {
    return [];
  }
  return JSON.parse(curr);
}

/**
 * @param {string} name
 * @param {URLSearchParams} urlSearchParams
 */
export function saveFormTemplate(name, urlSearchParams) {
  const res = loadFormTemplates();
  res.push({
    name,
    urlSearchParams: urlSearchParams.toString(),
  });
  window.localStorage.setItem(
    FORM_TEMPLATES_LOCALSTORAGE_KEY,
    JSON.stringify(res)
  );
}

/**
 *
 * @param {number} index
 */
export function deleteFormTemplate(index) {
  const curr = loadFormTemplates();
  curr.splice(index, 1);
  window.localStorage.setItem(
    FORM_TEMPLATES_LOCALSTORAGE_KEY,
    JSON.stringify(curr)
  );
}

/**
 *
 * @param {SaveFormTemplate} _args
 */
function addFormTemplate({ name, urlSearchParams }) {
  /** @type {HTMLDivElement} */
  // @ts-ignore
  const div = document.getElementById("saved-templates-div");
  /** @type {HTMLTemplateElement} */
  // @ts-ignore
  const template = document.getElementById("saved-template-template");
  /** @type {HTMLDivElement} */
  // @ts-ignore
  const newFormTemplateRow = template.content.firstElementChild.cloneNode(true);
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const selectBtn = newFormTemplateRow.querySelector(
    `button:not([aria-label="close"])`
  );
  selectBtn.onclick = () => {
    window.location.href = `${window.location.origin}?${urlSearchParams}`;
  };
  /** @type {HTMLButtonElement} */
  // @ts-ignore
  const closeBtn = newFormTemplateRow.querySelector(
    `button[aria-label="close"]`
  );
  closeBtn.onclick = async () => {
    const shouldDelete = await confirmViaDialog("Delete template?");
    if (!shouldDelete) {
      return;
    }
    const index = Array.from(div.children).indexOf(newFormTemplateRow);
    deleteFormTemplate(index);
    div.removeChild(newFormTemplateRow);
  };
  /** @type {HTMLHeadingElement} */
  // @ts-ignore
  const h3 = newFormTemplateRow.querySelector("h3");
  h3.innerText = name;

  div.appendChild(newFormTemplateRow);
}

export function loadAndRenderFormTemplates() {
  /** @type {HTMLDivElement} */
  // @ts-ignore
  const div = document.getElementById("saved-templates-div");
  div.innerHTML = "";
  const templates = loadFormTemplates();
  /** @type {HTMLParagraphElement} */
  // @ts-ignore
  const noTemplatesYetPara = document.getElementById("no-templates-yet-para");
  if (
    templates.length > 0 &&
    !noTemplatesYetPara.classList.contains("hidden")
  ) {
    noTemplatesYetPara.classList.add("hidden");
  }
  if (
    templates.length === 0 &&
    noTemplatesYetPara.classList.contains("hidden")
  ) {
    noTemplatesYetPara.classList.remove("hidden");
  }
  for (const saved of templates) {
    addFormTemplate(saved);
  }
}
