import { JwtPayload } from "jsonwebtoken";

export interface TokenProvider {
  generateToken(payload: object): string;
  verifyToken(token: string): string | JwtPayload | null;
}
