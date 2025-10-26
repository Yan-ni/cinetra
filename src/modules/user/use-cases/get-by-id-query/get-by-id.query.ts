import { UserRepository } from "../../model/user.repository";


export class GetByIdQuery {
  private userRepository: UserRepository;
  
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);
    return user;
  }
}