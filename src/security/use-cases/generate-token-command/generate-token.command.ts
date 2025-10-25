import { TokenProvider } from "../../model/token.provider";

export class GenerateTokenCommand {
  constructor(
    private readonly tokenProvider: TokenProvider
  ) {}

  execute(userId: string): string {
    const payload = { sub: userId };
    return this.tokenProvider.generateToken(payload);
  }
}
