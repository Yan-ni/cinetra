import { UserRepository } from "../../model/user.repository";
import { User, CreateUserDto } from "../../model/user.entity";

export class CreateCommand {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(userData: CreateUserDto): Promise<User> {
    return this.userRepository.create(userData);
  }
}