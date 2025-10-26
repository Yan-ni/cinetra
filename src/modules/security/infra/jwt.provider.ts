import jwt, { JwtPayload } from 'jsonwebtoken';
import { TokenProvider } from '../model/token.provider';

export class JwtProvider implements TokenProvider {
  private secretKey: string;

  constructor() {
    if (process.env.JWT_SECRET === undefined) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    this.secretKey = process.env.JWT_SECRET;
  }

  generateToken(payload: Object): string {
    return jwt.sign(payload, this.secretKey);
  }

  verifyToken(token: string): string | JwtPayload | null {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      return null;
    }
  }
}