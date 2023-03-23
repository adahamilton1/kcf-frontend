/**
 * Optional fields bec some wallets allow user
 * to select which account they wish to connect
 * @typedef ConnectWalletArgs
 * @property {string} [account]
 * @property {string} [pubKey]
 */

import { UnimplementedError } from "@/js/common/errs";

export class WalletAdapter {
  // idk why eslint cant parse class field declarations

  /* eslint-disable */
  /** @type {string} */
  account;

  /** @type {string} */
  pubKey;
  /* eslint-enable */

  /**
   *
   * @param {string} account
   * @param {string} pubKey
   */
  constructor(account, pubKey) {
    this.account = account;
    this.pubKey = pubKey;
  }

  /**
   * @param {ConnectWalletArgs} _args
   * @returns {Promise<WalletAdapter>}
   * @throws if connection failed
   */
  static async connect(_args) {
    throw new UnimplementedError();
  }

  /**
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line class-methods-use-this
  async disconnect() {
    throw new UnimplementedError();
  }

  /**
   * @returns {Promise<boolean>}
   */
  static async isInstalled() {
    throw new UnimplementedError();
  }

  /**
   * @param {import("@kadena/client").PactCommand} _cmd
   * @returns {Promise<import("@kadena/types/src/PactCommand").ICommand>} the signed tx, ready to JSON.stringify and send
   * @throws if signing failed
   */
  // eslint-disable-next-line class-methods-use-this
  async signCmd(_cmd) {
    throw new UnimplementedError();
  }
}
