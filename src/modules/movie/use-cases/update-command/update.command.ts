import { MovieRepository } from "../../model/movie.repository";

interface UpdateMovieDto {
  name?: string;
  overview?: string;
  posterURL?: string;
  favorite?: boolean;
  showId?: number;
}

export class UpdateCommand {
  private movieRepository: MovieRepository

  constructor(movieRepository: MovieRepository) {
    this.movieRepository = movieRepository;
  }

  async execute(movieId: string, movieData: UpdateMovieDto, userId: string) {
    return await this.movieRepository.update(movieId, movieData, userId);
  }
}
