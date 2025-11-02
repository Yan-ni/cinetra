import { TokenProvider } from "../../model/token.provider";

export class VerifyTokenCommand {
  constructor(private tokenProvider: TokenProvider) {}

  execute(token: string): any {
    try {
      return this.tokenProvider.verifyToken(token);
    } catch (error) {
      return null;
    }
  }
}