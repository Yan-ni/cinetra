import { ShowRepository } from "../../model/show.repository";

export class GetAllQuery {
  private showRepository: ShowRepository;

  constructor(showRepository: ShowRepository) {
    this.showRepository = showRepository;
  }

  async execute(userId: string) {
    return await this.showRepository.findAll(userId);
  }
}