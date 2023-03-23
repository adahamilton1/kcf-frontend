import { WalletAdapter } from "@/js/lib/kda/walletAdapter/walletAdapter";
import { DEFAULT_NETWORK_ID } from "@/js/lib/kcf/consts";
import { signerPubkeys } from "@/js/lib/kda/utils";

export class EckoWallet extends WalletAdapter {
  /**
   * @override
   * @param {import("@/js/lib/kda/walletAdapter/walletAdapter").ConnectWalletArgs} _args
   * @returns {Promise<EckoWallet>}
   */
  static async connect(_args) {
    const maybeEcko = await initIfConn();
    if (maybeEcko) {
      return maybeEcko;
    }
    // @ts-ignore
    const { kadena } = window;
    const resp = await kadena.request({
      method: "kda_connect",
      networkId: DEFAULT_NETWORK_ID,
    });
    if (resp.status !== "success") {
      throw new Error(JSON.stringify(resp));
    }
    const ecko = await initIfConn();
    if (!ecko) {
      throw new Error("Ecko wallet did not finish connecting");
    }
    return ecko;
  }

  /**
   * @override
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line class-methods-use-this
  async disconnect() {
    // @ts-ignore
    const { kadena } = window;
    await kadena.request({
      method: "kda_disconnect",
      networkId: DEFAULT_NETWORK_ID,
    });
  }

  /**
   *
   * @override
   * @returns {Promise<boolean>}
   */
  static async isInstalled() {
    // @ts-ignore
    return Boolean(window.kadena && window.kadena.isKadena);
  }

  /**
   * @override
   * @param {import("@kadena/client").PactCommand} cmd
   * @returns {Promise<import("@kadena/types/src/PactCommand").ICommand>} the signature for `cmd` by pubKey
   */
  // eslint-disable-next-line class-methods-use-this
  async signCmd(cmd) {
    const { cmd: cmdStr, hash } = cmd.createCommand();
    // @ts-ignore
    const { kadena } = window;
    const resp = await kadena.request({
      method: "kda_requestQuickSign",
      data: {
        networkId: DEFAULT_NETWORK_ID,
        commandSigDatas: [
          {
            sigs: signerPubkeys(cmd.signers).map((pubkey) => ({
              pubKey: pubkey,
              sig: null,
            })),
            cmd: cmdStr,
          },
        ],
      },
    });
    if (resp.status !== "success") {
      throw new Error(JSON.stringify(resp));
    }
    // console.log("EW", resp);
    const {
      commandSigData: { sigs },
    } = resp.quickSignData[0];
    return {
      cmd: cmdStr,
      hash,
      sigs: sigs.filter(({ sig }) => Boolean(sig)).map(({ sig }) => ({ sig })),
    };
  }
}

/**
 * @returns {Promise<EckoWallet | null>}
 */
async function initIfConn() {
  // @ts-ignore
  const { kadena } = window;
  const isAlrdyConn = await kadena.request({
    method: "kda_checkStatus",
    networkId: DEFAULT_NETWORK_ID,
  });
  if (isAlrdyConn.status === "success") {
    const {
      account: { account, publicKey },
    } = isAlrdyConn;
    return new EckoWallet(account, publicKey);
  }
  return null;
}
