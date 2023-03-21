/* eslint-disable no-restricted-imports */
/** API SERVER-SIDE ONLY FUNCTIONS  */

// /api doesnt allow custom @/ paths

import { sign } from "@kadena/cryptography-utils";
import { FLIP_CMD } from "./consts";

/**
 * Modifies `tx` in-place
 * @param {import("@kadena/types").ICommand} cmd
 */
export function signWithDealer(cmd) {
  const { sig } = sign(cmd.cmd, {
    secretKey: process.env.DEALER_SECRET_KEY,
    // @ts-ignore
    publicKey: process.env.DEALER_PUBLIC_KEY,
  });
  // @ts-ignore
  cmd.sigs.push({ sig });
}

export class VerifyCmdError extends Error {}

/**
 * Checks that the user isnt trying to cheat
 * @param {import("@kadena/types").ICommand} cmd
 * @throws {VerifyCmdError} if cmd is malformed
 */
export function verifyCmd({ cmd }) {
  /** @type {import("@kadena/types").ICommandPayload} */
  const { payload } = JSON.parse(cmd);
  /** @type {string} */
  // @ts-ignore
  const pactCode = payload.exec.code;
  if (pactCode !== FLIP_CMD) {
    throw new VerifyCmdError();
  }
}
