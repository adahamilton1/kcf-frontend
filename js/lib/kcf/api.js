/** API SERVER-SIDE ONLY FUNCTIONS  */

import { sign } from "@kadena/cryptography-utils";

/**
 * Modifies `tx` in-place
 * @param {import("@kadena/types").ICommand} cmd 
 */
export function signWithDealer(cmd) {
  const { sig } = sign(
    cmd.cmd,
    {
      secretKey: process.env.DEALER_SECRET_KEY,
      // @ts-ignore
      publicKey: process.env.DEALER_PUBLIC_KEY,
    }
  );
  // @ts-ignore
  cmd.sigs.push({ sig });
}
