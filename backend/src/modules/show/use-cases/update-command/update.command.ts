import { ShowRepository } from "../../model/show.repository";
import { Show, UpdateShowDto } from "../../model/show.entity";

export class UpdateCommand {
  private showRepository: ShowRepository

  constructor(showRepository: ShowRepository) {
    this.showRepository = showRepository;
  }

  async execute(showId: string, showData: UpdateShowDto, userId: string): Promise<Show | null> {
    return await this.showRepository.update(showId, showData, userId);
  }
}
