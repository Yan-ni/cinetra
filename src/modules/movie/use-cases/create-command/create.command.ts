import { MovieRepository } from "../../model/movie.repository";

interface CreateMovieDto {
  name: string;
  overview?: string;
  posterURL?: string;
  favorite?: boolean;
  showId?: number;
}

export class CreateCommand {
  private movieRepository: MovieRepository

  constructor(movieRepository: MovieRepository) {
    this.movieRepository = movieRepository;
  }

  async execute(movieData: CreateMovieDto, userId: string) {
    // Check if movie with same showId already exists for this user
    if (movieData.showId) {
      const existingMovie = await this.movieRepository.findByShowId(movieData.showId, userId);
      if (existingMovie) {
        throw new Error('Movie already exists');
      }
    }
    
    return await this.movieRepository.create(movieData, userId);
  }
}
