import { WalletAdapter } from "@/js/lib/kda/walletAdapter/walletAdapter";
import { isKAccount, toChainweaverSigningRequest } from "@/js/lib/kda/utils";

export class NotKAccountError extends Error {}

export class InsufficientAccountInfo extends Error {}

export class ChainweaverWallet extends WalletAdapter {
  /**
   * @override
   * @param {import("@/js/lib/kda/walletAdapter/walletAdapter").ConnectWalletArgs} args
   * @returns {Promise<ChainweaverWallet>}
   */
  static async connect({ account: accountOpt, pubKey: pubKeyOpt }) {
    if (!accountOpt && !pubKeyOpt) {
      throw new InsufficientAccountInfo();
    }
    if (accountOpt && !isKAccount(accountOpt)) {
      throw new NotKAccountError();
    }
    let account = accountOpt;
    let pubKey = pubKeyOpt;
    if (account && !pubKey) {
      pubKey = account.substring(2);
    }
    if (!account && pubKey) {
      account = `k:${pubKey}`;
    }
    // @ts-ignore
    return new ChainweaverWallet(account, pubKey);
  }

  /**
   * @override
   * @param {import("@kadena/client").PactCommand} cmd
   * @returns {Promise<import("@kadena/types/src/PactCommand").ICommand>} the signature for `cmd` by pubKey
   */
  // eslint-disable-next-line class-methods-use-this
  async signCmd(cmd) {
    // quicksign doesnt seem to work rn
    const r = await fetch("http://localhost:9467/v1/sign", {
      method: "POST",
      body: JSON.stringify(toChainweaverSigningRequest(cmd)),
      headers: {
        "Content-type": "application/json",
      },
    });
    const resp = await r.json();
    // console.log("CW", resp);
    return resp.body;
  }
}
