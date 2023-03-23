import { PactCommand } from "@kadena/client";
import {
  DEALER_PUBKEY,
  DEFAULT_META,
  DEFAULT_NETWORK_ID,
  FEE_ACCOUNT,
  FEE_RATE,
  FLIP_CMD,
  FLIP_GAS_LIMIT,
  HOUSE_ACCOUNT,
  KCF_CHAIN_ID,
} from "@/js/lib/kcf/consts";
import { localTxFullUrl, sendTxFullUrl } from "@/js/lib/kda/utils";

/**
 * @typedef FlipTxArgs
 * @property {string} pubKey
 * @property {number} amount
 * @property {boolean} isHeads
 * @property {string} [player] also the tx sender. Defaults to `k:{pubKey}` if not provided
 * @property {number} [ttl]
 * @property {number} [gasPrice]
 * @property {Parameters<import("@kadena/client").PactCommand["setMeta"]>[1]} [networkId]
 */

/**
 * @param {FlipTxArgs} _unnamed
 * @returns {PactCommand}
 */
export function flipTx({
  pubKey,
  amount,
  isHeads,
  player: playerOpt,
  ttl,
  gasPrice,
  networkId,
}) {
  const player = playerOpt ?? `k:${pubKey}`;
  const cmd = new PactCommand();
  cmd.code = FLIP_CMD;
  cmd.addData({
    player,
    choice: isHeads ? 1 : 0,
    amount,
  });
  // TODO: customizable sender for gas stations
  cmd.setMeta(
    {
      ttl: ttl ?? DEFAULT_META.ttl,
      gasPrice: gasPrice ?? DEFAULT_META.gasPrice,
      sender: player,
      gasLimit: FLIP_GAS_LIMIT,
      chainId: KCF_CHAIN_ID,
    },
    networkId ?? DEFAULT_NETWORK_ID
  );
  // NB: LegacySigningRequest only allows one signer,
  // we are assuming signers[0] is user so make sure these caps
  // are added first before DEALER
  cmd.addCap("coin.GAS", pubKey);
  // @ts-ignore
  cmd.addCap("coin.TRANSFER", pubKey, player, HOUSE_ACCOUNT, amount);
  // @ts-ignore
  cmd.addCap("coin.TRANSFER", pubKey, player, FEE_ACCOUNT, FEE_RATE * amount);
  // @ts-ignore
  cmd.addCap("free.kcf.DEALER", DEALER_PUBKEY);
  return cmd;
}

export async function flipLocalTx(tx) {
  const resp = await localTxFullUrl("/api/local", tx);
  return resp;
}

export async function flipSendTx(tx) {
  const resp = await sendTxFullUrl("/api/send", tx);
  return resp;
}
