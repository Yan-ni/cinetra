import bcrypt from "bcrypt";

export class BcryptProvider {
  private saltRounds: string | number;

  constructor() {
    this.saltRounds = process.env.SALT_ROUNDS || 10;
  }

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async compare(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
