import { ApiService } from "./api.service";
import { MovieType } from "@/types";

interface CreateMovieData {
  name: string;
  overview?: string;
  posterURL?: string;
  favorite?: boolean;
}

interface UpdateMovieData {
  name?: string;
  overview?: string;
  posterURL?: string;
  favorite?: boolean;
}

interface MovieSearchResult {
  name: string;
  overview: string;
  posterURL: string;
}

class MovieServiceClass extends ApiService {
  async getAllMovies(): Promise<MovieType[]> {
    const response = await this.get<MovieType[]>("/movie");
    return response.data;
  }

  async getMovieById(id: string): Promise<MovieType> {
    const response = await this.get<MovieType>(`/movie/${id}`);
    return response.data;
  }

  async createMovie(data: CreateMovieData): Promise<MovieType> {
    const response = await this.post<MovieType>("/movie", data);
    return response.data;
  }

  async updateMovie(id: string, data: UpdateMovieData): Promise<MovieType> {
    const response = await this.put<MovieType>(`/movie/${id}`, data);
    return response.data;
  }

  async deleteMovie(id: string): Promise<void> {
    await this.delete(`/movie/${id}`);
  }

  async searchMovies(query: string): Promise<MovieSearchResult[]> {
    const response = await this.get<MovieSearchResult[]>(`/movie/search?q=${query}`);
    return response.data;
  }

  async toggleFavorite(id: string, favorite: boolean): Promise<MovieType> {
    const response = await this.put<MovieType>(`/movie/${id}`, { favorite });
    return response.data;
  }
}

export const MovieService = new MovieServiceClass();
