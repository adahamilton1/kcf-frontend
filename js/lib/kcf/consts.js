export const FEE_ACCOUNT = "c:b3FVhcuHChX_aknt2Ouf0FoGk820FEaapzJJQvBWxwA";

export const HOUSE_ACCOUNT = "c:YQDr866n8qiHP2-S-8Sz98cMBwrQ2YvLd74vetYq3TE";

export const FLIP_CMD = "(free.kcf.flip)";

export const FLIP_GAS_LIMIT = 2000;

export const FEE_RATE = 0.03;

/**
 * @type {import("@kadena/client").PactCommand["publicMeta"]["chainId"]}
 */
export const KCF_CHAIN_ID = "1"; // 1 on testnet, 2 on mainnet

export const DEFAULT_GAS_PRICE = 1e-7;

export const DEFAULT_TTL_S = 600;

export const DEFAULT_NETWORK_ID = "testnet04";

export const DEFAULT_CHAINWEB_ENDPOINT = "https://api.testnet.chainweb.com";

/**
 * @type {Omit<import("@kadena/client").PactCommand["publicMeta"], "gasLimit" | "chainId" | "sender">}
 */
export const DEFAULT_META = {
  gasPrice: DEFAULT_GAS_PRICE,
  ttl: DEFAULT_TTL_S,
};
