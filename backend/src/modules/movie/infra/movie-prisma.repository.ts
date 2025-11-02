import { MovieRepository } from "../model/movie.repository";
import { Movie, CreateMovieDto, UpdateMovieDto } from "../model/movie.entity";
import { PrismaClient } from '../../../../generated/prisma/client';

export class MoviePrismaRepository implements MovieRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findById(movieId: string, userId: string): Promise<Movie | null> {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId, userId: userId }
    });
    return movie;
  }

  async findAll(userId: string): Promise<Movie[]> {
    const movies = await this.prisma.movie.findMany({
      where: { userId: userId },
      orderBy: { updatedAt: 'desc' }
    });
    return movies;
  }

  async findByShowId(showId: number, userId: string): Promise<Movie | null> {
    const movie = await this.prisma.movie.findFirst({
      where: { showId: showId, userId: userId }
    });
    return movie;
  }

  async create(movieData: CreateMovieDto, userId: string): Promise<Movie> {
    const newMovie = await this.prisma.movie.create({
      data: {...movieData, userId: userId}
    });
    return newMovie;
  }

  async update(movieId: string, movieData: UpdateMovieDto, userId: string): Promise<Movie | null> {
    // First check if the movie exists and belongs to the user
    const existingMovie = await this.prisma.movie.findFirst({
      where: { id: movieId, userId: userId }
    });

    if (!existingMovie) {
      return null;
    }

    const updatedMovie = await this.prisma.movie.update({
      where: { id: movieId },
      data: movieData
    });
    return updatedMovie;
  }

  async delete(movieId: string, userId: string): Promise<{ count: number }> {
    const movie = await this.prisma.movie.deleteMany({
      where: { id: movieId, userId: userId }
    });
    return movie;
  }
}
