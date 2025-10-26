import { UserRepository } from "../../model/user.repository";
import { User } from "../../model/user.entity";

export class GetByIdQuery {
  private userRepository: UserRepository;
  
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId: string): Promise<User | null> {
    const user = await this.userRepository.findById(userId);
    return user;
  }
}