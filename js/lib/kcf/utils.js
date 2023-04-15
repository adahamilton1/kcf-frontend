/**
 *
 * @param {import("@kcf/kda-wallet-base").KdaWallet} wallet
 * @returns {import("@kcf/kda-wallet-base").AccountPubkey}
 */
export function getConnectedAccountPubkey(wallet) {
  const accountPk = wallet.accounts[0];
  if (!accountPk) {
    throw new Error("connected wallet has no accounts");
  }
  return accountPk;
}
