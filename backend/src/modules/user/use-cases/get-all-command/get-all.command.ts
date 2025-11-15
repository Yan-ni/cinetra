import { UserRepository } from "../../model/user.repository";
import { User } from "../../model/user.entity";

export class GetAllCommand {
  constructor(private userRepository: UserRepository) {}
  
  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
