export class UnreachableError extends Error {}

export class UnimplementedError extends Error {}

export class NoWalletConnectedError extends Error {
  constructor() {
    super("No wallet connected");
  }
}
