import { ShowRepository } from "../../model/show.repository";
import { Show, CreateShowDto } from "../../model/show.entity";

export class CreateCommand {
  private showRepository: ShowRepository

  constructor(showRepository: ShowRepository) {
    this.showRepository = showRepository;
  }

  async execute(showData: CreateShowDto, userId: string): Promise<Show> {
    return await this.showRepository.create(showData, userId);
  }
}