import { defaultChainwebEndpoint } from "@/js/lib/kda/utils";
import { PactCommand } from "@kadena/client";
import {
  matchCapArg,
  matchCapIndex,
  matchCapSigner,
  parseCapArg,
  parseCapIndex,
  parseCapSigner,
} from "@/js/index/utils";
import { getConnectWalletDialog } from "@/js/index/connectWalletDialog";

/**
 * @typedef {{
 *  signer: string;
 *  cap: string;
 *  args: Map<number, string>;
 * }} CapVal
 */

/**
 * @returns {{
 *  cmd: PactCommand;
 *  chainwebEndpoint: string;
 * }}
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
  // @ts-ignore
  cmd.setMeta({}, networkId);
  if (!chainwebEndpoint) {
    chainwebEndpoint = defaultChainwebEndpoint(cmd.networkId);
  }
  const { connectedWallet } = getConnectWalletDialog();
  if (capMap.size > 0) {
    if (!connectedWallet) {
      throw new Error("No wallet connected");
    }
    const { pubKey } = connectedWallet.accounts[0];
    for (const { signer, cap, args } of capMap.values()) {
      parseAndAddCap(cmd, cap, args, signer, pubKey);
    }
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
