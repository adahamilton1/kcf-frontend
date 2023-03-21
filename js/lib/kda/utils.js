/**
 * @typedef SigningRequest
 * @property {string} code
 * @property {Record<string, unknown>} data
 * @property {DappCap[]} caps
 * @property {string} nonce
 * @property {import("@kadena/client").PactCommand["publicMeta"]["chainId"]} chainId
 * @property {number} gasLimit
 * @property {number} gasPrice
 * @property {number} ttl
 * @property {string} sender
 * @property {string[]} extraSigners
 *
 */

import { DEFAULT_NETWORK_ID } from "@/js/lib/kcf/consts";

/**
 * @typedef DappCap
 * @property {string} role
 * @property {string} description
 * @property {SigCapability} cap
 */

/**
 * @typedef SigCapability
 * @property {string} name
 * @property {string[]} args
 */

/**
 *
 * @param {import("@kadena/client").IPactCommand} _unnamed
 * @return {SigningRequest}
 */
export function toChainweaverSigningRequest({
  code,
  data,
  publicMeta: { chainId, gasLimit, gasPrice, ttl, sender },
  signers,
}) {
  const [_sender, ...extraSigners] = signers;
  return {
    code,
    data,
    caps: signers.flatMap(({ caps }) => caps.map(toDappCapps)),
    nonce: Date.now().toString(),
    chainId,
    gasLimit,
    gasPrice,
    ttl,
    sender,
    extraSigners: extraSigners.map(({ pubKey }) => pubKey),
  };
}

/**
 *
 * @param {import("@kadena/client").IPactCommand["signers"][number]["caps"][number]} signer
 * @return {DappCap}
 */
function toDappCapps({ name, args }) {
  return {
    role: name.toUpperCase(),
    description: name,
    cap: {
      name,
      // @ts-ignore
      args,
    },
  };
}

/**
 *
 * @param {string} baseUrl baseUrl without trailing /, e.g. https://api.testnet.chainweb.com
 * @param {import("@kadena/types/src/PactCommand").ICommand} tx
 * @returns {string} pact API host, e.g. https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1
 */
export function mkPactApiHost(baseUrl, tx) {
  // @ts-ignore
  const networkId = /"networkId":"(mainnet01|testnet04)"/.exec(tx.cmd)[1];
  /** @type {import("@kadena/types").ChainId} */
  // @ts-ignore
  const chainId = /"chainId":"([0-9]{1,2})"/.exec(tx.cmd)[1];
  return mkPactApiHostFromBase(baseUrl, networkId, chainId);
}

/**
 *
 * @param {string} baseUrl
 * @param {import("@kadena/types").NetworkId} networkId
 * @param {import("@kadena/types").ChainId} chainId
 * @returns
 */
export function mkPactApiHostFromBase(baseUrl, networkId, chainId) {
  return `${baseUrl}/chainweb/0.0/${networkId}/chain/${chainId}/pact/api/v1`;
}

/**
 *
 * @param {string} baseUrl baseUrl without trailing /, e.g. https://api.testnet.chainweb.com
 * @param {import("@kadena/types/src/PactCommand").ICommand} tx
 * @return {Promise<import("@kadena/types/src/PactAPI").LocalResponse>}
 */
export async function localTx(baseUrl, tx) {
  const r = await fetch(`${mkPactApiHost(baseUrl, tx)}/local`, {
    method: "POST",
    body: JSON.stringify(tx),
    headers: {
      "Content-type": "application/json",
    },
  });
  const resp = await r.json();
  return resp;
}

/**
 *
 * @param {string} baseUrl baseUrl without trailing /, e.g. https://api.testnet.chainweb.com
 * @param {import("@kadena/types/src/PactCommand").ICommand} tx
 * @return {Promise<import("@kadena/types/src/PactAPI").SendResponse>}
 */
export async function sendTx(baseUrl, tx) {
  const r = await fetch(`${mkPactApiHost(baseUrl, tx)}/send`, {
    method: "POST",
    body: JSON.stringify({ cmds: [tx] }),
    headers: {
      "Content-type": "application/json",
    },
  });
  const resp = await r.json();
  return resp;
}

/**
 *
 * @param {string} baseUrl
 * @param {string[]} requestKeys
 * @param {import("@kadena/types").NetworkId} networkId
 * @param {import("@kadena/types").ChainId} chainId
 * @returns {Promise<import("@kadena/types").IPollResponse>}
 */
export async function pollTxs(baseUrl, requestKeys, networkId, chainId) {
  const r = await fetch(
    `${mkPactApiHostFromBase(baseUrl, networkId, chainId)}/poll`,
    {
      method: "POST",
      body: JSON.stringify({ requestKeys }),
      headers: {
        "Content-type": "application/json",
      },
    }
  );
  const resp = await r.json();
  return resp;
}

/**
 *
 * @param {string} account
 */
export function isKAccount(account) {
  return account.startsWith("k:") && account.length === 66;
}

/**
 *
 * @param {string} reqKey
 */
export function toExplorerLink(reqKey) {
  return `https://explorer.chainweb.com/${
    DEFAULT_NETWORK_ID === "testnet04" ? "testnet" : "mainnet"
  }/txdetail/${reqKey}`;
  // return `https://kadena.architech.nyc/txdetail/${reqKey}`
}
