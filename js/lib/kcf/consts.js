const IS_MAINNET = true;

export const FEE_ACCOUNT = "c:b3FVhcuHChX_aknt2Ouf0FoGk820FEaapzJJQvBWxwA";

export const HOUSE_ACCOUNT = "c:YQDr866n8qiHP2-S-8Sz98cMBwrQ2YvLd74vetYq3TE";

export const FLIP_CMD = "(free.kcf.flip)";

export const FLIP_GAS_LIMIT = 3000;

export const FEE_RATE = 0.03;

export const DEFAULT_GAS_PRICE = 1e-7;

export const DEFAULT_TTL_S = 600;

/**
 * @type {import("@kadena/client").PactCommand["publicMeta"]["chainId"]}
 */
export const KCF_CHAIN_ID = IS_MAINNET ? "2" : "1";

export const DEFAULT_NETWORK_ID = IS_MAINNET ? "mainnet01" : "testnet04";

export const DEFAULT_CHAINWEB_ENDPOINT = IS_MAINNET
  ? "https://api.chainweb.com"
  : "https://api.testnet.chainweb.com";

/**
 * @type {Omit<import("@kadena/client").PactCommand["publicMeta"], "gasLimit" | "chainId" | "sender">}
 */
export const DEFAULT_META = {
  gasPrice: DEFAULT_GAS_PRICE,
  ttl: DEFAULT_TTL_S,
};

export const DEALER_PUBKEY =
  "1aed7ea4bddbc8fc667742034e84973a96ca695a8950c41ba3d4318245712e5a";
