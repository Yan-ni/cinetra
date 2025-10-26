import { ShowRepository } from "../../model/show.repository";

export class DeleteCommand {
  private showRepository: ShowRepository

  constructor(showRepository: ShowRepository) {
    this.showRepository = showRepository;
  }

  async execute(showId: string, userId: string) {
    return await this.showRepository.delete(showId, userId);
  }
}
