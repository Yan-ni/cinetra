import { Movie, CreateMovieDto, UpdateMovieDto } from './movie.entity';

export interface MovieRepository {
  findById(movieId: string, userId: string): Promise<Movie | null>;
  findAll(userId: string): Promise<Movie[]>;
  findByShowId(showId: number, userId: string): Promise<Movie | null>;
  create(movieData: CreateMovieDto, userId: string): Promise<Movie>;
  update(movieId: string, movieData: UpdateMovieDto, userId: string): Promise<Movie | null>;
  delete(movieId: string, userId: string): Promise<{ count: number }>;
}
