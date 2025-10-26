import { MovieRepository } from "../../model/movie.repository";

export class DeleteCommand {
  private movieRepository: MovieRepository

  constructor(movieRepository: MovieRepository) {
    this.movieRepository = movieRepository;
  }

  async execute(movieId: string, userId: string) {
    return await this.movieRepository.delete(movieId, userId);
  }
}
