import { HashProvider } from "../../model/hash.provider";

export class HashPasswordCommand {
  private hasher: HashProvider;

  constructor(hasher: HashProvider) {
    this.hasher = hasher;
  }

  async execute(password: string): Promise<string> {
    return await this.hasher.hash(password);
  }
}
