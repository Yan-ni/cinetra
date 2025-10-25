import { JwtProvider } from "./infra/jwt.provider";
import { BcryptProvider } from "./infra/bcrypt.provider";
import { HashPasswordCommand } from "./use-cases/hash-password-command/hash-password.command";
import { GenerateTokenCommand } from "./use-cases/generate-token-command/generate-token.command";
import { VerifyPasswordCommand } from "./use-cases/verify-password-command/verify-password.command";
import { VerifyTokenCommand } from "./use-cases/verify-token-command/verify-token.command";

const bcryptProvider = new BcryptProvider();
const jwtProvider = new JwtProvider();

export const securityModule = {
  Commands: {
    HashPasswordCommand: new HashPasswordCommand(bcryptProvider),
    VerifyPasswordCommand: new VerifyPasswordCommand(bcryptProvider),
    GenerateTokenCommand: new GenerateTokenCommand(jwtProvider),
    VerifyTokenCommand: new VerifyTokenCommand(jwtProvider),
  }
}
