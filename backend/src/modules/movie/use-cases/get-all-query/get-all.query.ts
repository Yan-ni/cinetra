import { MovieRepository } from '../../model/movie.repository';
import { Movie } from '../../model/movie.entity';

export class GetAllQuery {
  private movieRepository: MovieRepository;

  constructor(movieRepository: MovieRepository) {
    this.movieRepository = movieRepository;
  }

  async execute(userId: string): Promise<Movie[]> {
    const movies = await this.movieRepository.findAll(userId);
    return movies;
  }
}
