import { TMDBService, SearchResult } from './tmdb.service';
import axios, { AxiosInstance } from 'axios';

interface ApiResponse {
  results: Array<{
    title?: string;
    name?: string;
    overview: string;
    poster_path: string;
  }>;
}

export class TMDBApiService implements TMDBService {
  private fetcher: AxiosInstance;

  constructor() {
    this.fetcher = axios.create({
      baseURL: 'https://api.themoviedb.org/3',
      headers: {
        Authorization: process.env.API_AUTHORIZATION,
      },
    })
  }

  async searchShows(query: string): Promise<SearchResult[]> {
    return this.search('tv', query);
  }

  async searchMovies(query: string): Promise<SearchResult[]> {
    return this.search('movie', query);
  }

  private async search(type: 'tv' | 'movie', query: string): Promise<SearchResult[]> {
    if (!query || query.length === 0) {
      return [];
    }

    try {
      const response = await this.fetcher.get<ApiResponse>(`/search/${type}?query=${encodeURIComponent(query)}`);

      const searchResults: SearchResult[] = response.data.results.map(
        ({ title, name, overview, poster_path }) => {
          return ({
            name: name || title || '',
            overview,
            posterURL: poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : '',
          })
        }
      );

      return searchResults;
    } catch (err) {
      console.error('TMDB API Error:', err);
      throw err;
    }
  }
}
