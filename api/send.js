import { signWithDealer } from "@/js/lib/kcf/api";
import { DEFAULT_CHAINWEB_ENDPOINT } from "@/js/lib/kcf/consts";
import { sendTx } from "@/js/lib/kda/utils";

export const config = {
  runtime: "edge",
  regions: [],
};

/**
 * @param {Request} req
 * @returns {Promise<Response>}
 */
export default async (req) => {
  if (req.method !== "POST") {
    return new Response("only POST allowed", { status: 400 });
  }
  /** @type {{ cmds: [import("@kadena/types").ICommand] }} */
  const { cmds: [cmd] } = await req.json();
  signWithDealer(cmd);
  const res = await sendTx(DEFAULT_CHAINWEB_ENDPOINT, cmd);
  return new Response(JSON.stringify(res));
}
