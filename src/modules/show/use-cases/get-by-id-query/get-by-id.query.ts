import { ShowRepository } from '../../model/show.repository';

export class GetByIdQuery {
  private showRepository: ShowRepository;

  constructor(showRepository: ShowRepository) {
    this.showRepository = showRepository;
  }

  async execute(showId: string, userId: string) {
    const show = await this.showRepository.findById(showId, userId);
    return show;
  }
}