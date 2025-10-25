import { UserRepository } from "../../model/user.repository";

export class GetAllCommand {
  constructor(private userRepository: UserRepository) {}
  async execute() {
    return this.userRepository.findAll();
  }
}
