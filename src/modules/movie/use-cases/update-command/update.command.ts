import { MovieRepository } from "../../model/movie.repository";
import { Movie, UpdateMovieDto } from "../../model/movie.entity";

export class UpdateCommand {
  private movieRepository: MovieRepository

  constructor(movieRepository: MovieRepository) {
    this.movieRepository = movieRepository;
  }

  async execute(movieId: string, movieData: UpdateMovieDto, userId: string): Promise<Movie | null> {
    return await this.movieRepository.update(movieId, movieData, userId);
  }
}
