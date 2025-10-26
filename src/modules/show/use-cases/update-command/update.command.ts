import { ShowRepository } from "../../model/show.repository";

interface UpdateShowDto {
  name?: string;
  overview?: string;
  posterURL?: string;
  seasonsWatched?: number;
  episodesWatched?: number;
  completed?: boolean;
  favorite?: boolean;
  showId?: string;
}

export class UpdateCommand {
  private showRepository: ShowRepository

  constructor(showRepository: ShowRepository) {
    this.showRepository = showRepository;
  }

  async execute(showId: string, showData: UpdateShowDto, userId: string) {
    return await this.showRepository.update(showId, showData, userId);
  }
}
