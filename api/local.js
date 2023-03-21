// /api doesnt allow custom @/ paths

import { signWithDealer, verifyCmd } from "../js/lib/kcf/api";
import { DEFAULT_CHAINWEB_ENDPOINT } from "../js/lib/kcf/consts";
import { localTx } from "../js/lib/kda/utils";

// TODO: re-enable edge when nodejs buffer and crypto is supported by vercel edge
/*
export const config = {
  runtime: "edge",
  regions: [],
};
*/

/**
 * @param {import("@vercel/node").VercelRequest} req
 * @param {import("@vercel/node").VercelResponse} resp
 */
export default async (req, resp) => {
  if (req.method !== "POST") {
    resp.status(400).send("only POST allowed");
    return;
  }
  /** @type {import("@kadena/types").ICommand} */
  const cmd = req.body;
  verifyCmd(cmd);
  signWithDealer(cmd);
  const res = await localTx(DEFAULT_CHAINWEB_ENDPOINT, cmd);
  resp.status(200).json(res);
};
