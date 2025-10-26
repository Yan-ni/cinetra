import { MovieRepository } from '../../model/movie.repository';

export class GetByIdQuery {
  private movieRepository: MovieRepository;

  constructor(movieRepository: MovieRepository) {
    this.movieRepository = movieRepository;
  }

  async execute(movieId: string, userId: string) {
    const movie = await this.movieRepository.findById(movieId, userId);
    return movie;
  }
}
