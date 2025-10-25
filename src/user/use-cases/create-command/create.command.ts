import { UserRepository } from "../../model/user.repository";

export class CreateCommand {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(userData: {username: string; email: string; password: string}) {
    return this.userRepository.create(userData);
  }
}