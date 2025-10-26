import { MovieRepository } from '../../model/movie.repository';
import { Movie } from '../../model/movie.entity';

export class GetByIdQuery {
  private movieRepository: MovieRepository;

  constructor(movieRepository: MovieRepository) {
    this.movieRepository = movieRepository;
  }

  async execute(movieId: string, userId: string): Promise<Movie | null> {
    const movie = await this.movieRepository.findById(movieId, userId);
    return movie;
  }
}
