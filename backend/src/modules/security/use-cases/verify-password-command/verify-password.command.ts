import { HashProvider } from "../../model/hash.provider";


export class VerifyPasswordCommand {
  private hashProvider: HashProvider;

  constructor(hashProvider: HashProvider) {
    this.hashProvider = hashProvider;
  }

  async execute(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return this.hashProvider.compare(plainTextPassword, hashedPassword);
  }
}