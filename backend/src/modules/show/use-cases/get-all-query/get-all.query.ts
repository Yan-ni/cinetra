import { ShowRepository } from "../../model/show.repository";
import { Show } from "../../model/show.entity";

export class GetAllQuery {
  private showRepository: ShowRepository;

  constructor(showRepository: ShowRepository) {
    this.showRepository = showRepository;
  }

  async execute(userId: string): Promise<Show[]> {
    return await this.showRepository.findAll(userId);
  }
}