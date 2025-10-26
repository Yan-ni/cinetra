import { ShowRepository } from "../../model/show.repository";


interface CreateShowDto {
  name: string;
  overview?: string;
  posterURL?: string;
  seasonsWatched?: number;
  episodesWatched?: number;
  completed?: boolean;
  favorite?: boolean;
  userId?: string;
  showId?: string;
}

export class CreateCommand {
  private showRepository: ShowRepository

  constructor(showRepository: ShowRepository) {
    this.showRepository = showRepository;
  }

  async execute(showData: CreateShowDto, userId: string) {
    return await this.showRepository.create(showData, userId);
  }
}