import { ShowRepository } from '../../model/show.repository';
import { Show } from '../../model/show.entity';

export class GetByIdQuery {
  private showRepository: ShowRepository;

  constructor(showRepository: ShowRepository) {
    this.showRepository = showRepository;
  }

  async execute(showId: string, userId: string): Promise<Show | null> {
    const show = await this.showRepository.findById(showId, userId);
    return show;
  }
}