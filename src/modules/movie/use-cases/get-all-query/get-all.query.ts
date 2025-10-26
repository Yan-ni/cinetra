import { MovieRepository } from '../../model/movie.repository';

export class GetAllQuery {
  private movieRepository: MovieRepository;

  constructor(movieRepository: MovieRepository) {
    this.movieRepository = movieRepository;
  }

  async execute(userId: string) {
    const movies = await this.movieRepository.findAll(userId);
    return movies;
  }
}
