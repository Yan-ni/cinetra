import { UserRepository } from "../../model/user.repository";
import { User } from "../../model/user.entity";

export class GetByEmailQuery {
  private userRepo: UserRepository;

  constructor(userRepo: UserRepository) {
    this.userRepo = userRepo;
  }

  async execute(email: string): Promise<User | null> {
    return this.userRepo.findByEmail(email);
  }
}