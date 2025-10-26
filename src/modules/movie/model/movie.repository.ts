export interface MovieRepository {
  findById(movieId: string, userId: string): Promise<any>;
  findAll(userId: string): Promise<any[]>;
  findByShowId(showId: number, userId: string): Promise<any>;
  create(movieData: any, userId: string): Promise<any>;
  update(movieId: string, movieData: any, userId: string): Promise<any>;
  delete(movieId: string, userId: string): Promise<any>;
}
