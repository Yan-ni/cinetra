import { MovieRepository } from "../../model/movie.repository";
import { Movie, CreateMovieDto } from "../../model/movie.entity";

export class CreateCommand {
  private movieRepository: MovieRepository

  constructor(movieRepository: MovieRepository) {
    this.movieRepository = movieRepository;
  }

  async execute(movieData: CreateMovieDto, userId: string): Promise<Movie> {
    return await this.movieRepository.create(movieData, userId);
  }
}
