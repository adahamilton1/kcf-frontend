import { WalletAdapter } from "@/js/lib/kda/walletAdapter/walletAdapter";
import { isKAccount, signerPubkeys } from "@/js/lib/kda/utils";
import {
  InsufficientAccountInfo,
  NotKAccountError,
} from "@/js/lib/kda/walletAdapter/chainweaverWallet";

const QUICKSIGN_ENDPOINT = "http://localhost:9467/v1/quicksign";

export class ChainweaverQuickSignWallet extends WalletAdapter {
  /**
   * @override
   * @param {import("@/js/lib/kda/walletAdapter/walletAdapter").ConnectWalletArgs} args
   * @returns {Promise<ChainweaverQuickSignWallet>}
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
    return new ChainweaverQuickSignWallet(account, pubKey);
  }

  /**
   * @override
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line class-methods-use-this, no-empty-function
  async disconnect() {}

  /**
   *
   * @override
   * @returns {Promise<boolean>}
   */
  static async isInstalled() {
    return true;
    /*
    try {
      // this will still output HTTP 405 on console
      // but will not throw
      await fetch(SIGNING_ENDPOINT);
      return true;
    } catch (e) {
      // ECONNREFUSED is thrown here
      return false;
    }
    */
  }

  /**
   * @override
   * @param {import("@kadena/client").PactCommand} cmd
   * @returns {Promise<import("@kadena/types/src/PactCommand").ICommand>} the signature for `cmd` by pubKey
   */
  // eslint-disable-next-line class-methods-use-this
  async signCmd(cmd) {
    const { cmd: cmdStr, hash } = cmd.createCommand();
    // quicksign doesnt seem to work rn
    const r = await fetch(QUICKSIGN_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({
        cmdSigDatas: [
          {
            cmd: cmdStr,
            sigs: signerPubkeys(cmd.signers).map((pubkey) => ({
              pubKey: pubkey,
              sig: null,
            })),
          },
        ],
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    const resp = await r.json();
    // console.log("CW", resp);
    const {
      commandSigData: { sigs },
    } = resp.responses[0];
    return {
      cmd: cmdStr,
      hash,
      sigs: sigs.filter(({ sig }) => Boolean(sig)).map(({ sig }) => ({ sig })),
    };
  }
}
