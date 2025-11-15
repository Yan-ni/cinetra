import { UserRepository } from "../../model/user.repository";
import { User, UpdateUserDto } from "../../model/user.entity";

export class UpdateCommand {
  private userRepository: UserRepository;
  
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId: string, data: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.update(userId, data);
    return user;
  }
}
