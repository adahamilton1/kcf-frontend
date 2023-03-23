/* eslint-disable no-restricted-imports */

/** FUNCTIONS HERE ARE USED SERVER-SIDE, DO NOT USE ANY @/ LOCAL IMPORTS */

import { DEFAULT_NETWORK_ID, DEFAULT_NETWORK_VERSION } from "../kcf/consts";

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

/**
 * This format is used by eckoWALLET, zelcore
 * Differences with SigningRequest:
 * - code -> pactCode
 * - data -> envData
 * - no `extraSigners`, only one `signingPubkey`
 * - +networkId
 * - +networkVersion
 *
 * @typedef LegacySigningRequest
 * @property {string} pactCode
 * @property {Record<string, unknown>} envData
 * @property {DappCap[]} caps
 * @property {string} nonce
 * @property {import("@kadena/client").PactCommand["publicMeta"]["chainId"]} chainId
 * @property {number} gasLimit
 * @property {number} gasPrice
 * @property {number} ttl
 * @property {string} sender
 * @property {string} signingPubkey
 * @property {import("@kadena/types").NetworkId} networkId
 * @property {string} networkVersion
 */

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
 * @param {import("@kadena/client").IPactCommand["signers"]} signers
 * @returns {[string, string[]]}
 */
function signerPubkeys(signers) {
  const [sender, ...extraSigners] = signers;
  const extraSignersPubkeys = [
    ...new Set(extraSigners.map(({ pubKey }) => pubKey)),
  ];
  return [sender.pubKey, extraSignersPubkeys];
}

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
  const [_sender, extraSigners] = signerPubkeys(signers);
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
    extraSigners,
  };
}

/**
 *
 * @param {import("@kadena/client").IPactCommand} _unnamed
 * @return {LegacySigningRequest}
 */
export function toLegacySigningRequest({
  code,
  data,
  publicMeta: { chainId, gasLimit, gasPrice, ttl, sender },
  signers,
}) {
  // TODO: find some way to use extraSigners
  const [signingPubkey] = signerPubkeys(signers);
  return {
    pactCode: code,
    envData: data,
    caps: signers.flatMap(({ caps }) => caps.map(toDappCapps)),
    nonce: Date.now().toString(),
    chainId,
    gasLimit,
    gasPrice,
    ttl,
    sender,
    signingPubkey,
    networkId: DEFAULT_NETWORK_ID,
    networkVersion: DEFAULT_NETWORK_VERSION,
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
  const resp = await localTxFullUrl(`${mkPactApiHost(baseUrl, tx)}/local`, tx);
  return resp;
}

/**
 *
 * @param {string} localEndpointFullUrl the fully qualified /local endpoint e.g. https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/local
 * @param {import("@kadena/types/src/PactCommand").ICommand} tx
 * @return {Promise<import("@kadena/types/src/PactAPI").LocalResponse>}
 */
export async function localTxFullUrl(localEndpointFullUrl, tx) {
  const r = await fetch(localEndpointFullUrl, {
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
  const resp = await sendTxFullUrl(`${mkPactApiHost(baseUrl, tx)}/send`, tx);
  return resp;
}

/**
 *
 * @param {string} sendEndpointFullUrl the fully qualified /send endpoint e.g. https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/send
 * @param {import("@kadena/types/src/PactCommand").ICommand} tx
 * @return {Promise<import("@kadena/types/src/PactAPI").SendResponse>}
 */
export async function sendTxFullUrl(sendEndpointFullUrl, tx) {
  const r = await fetch(sendEndpointFullUrl, {
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
