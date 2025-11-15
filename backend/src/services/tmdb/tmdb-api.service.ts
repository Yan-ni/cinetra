import { TMDBService, SearchResult } from './tmdb.service';

interface ApiResponse {
  results: Array<{
    id: string;
    title?: string;
    name?: string;
    overview: string;
    poster_path: string;
  }>;
}

export class TMDBApiService implements TMDBService {
  private apiAuthorization: string;
  private baseUrl: string = 'https://api.themoviedb.org/3';

  constructor(apiAuthorization: string) {
    this.apiAuthorization = apiAuthorization;
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
      const response = await fetch(
        `${this.baseUrl}/search/${type}?query=${encodeURIComponent(query)}`,
        { 
          headers: { 
            Authorization: this.apiAuthorization 
          } 
        }
      );

      if (response.status !== 200) {
        throw new Error(
          `TMDB API responded with status code ${response.status}`
        );
      }

      const responseJson: ApiResponse = await response.json() as ApiResponse;

      const searchResults: SearchResult[] = responseJson.results.map(
        ({ id, title, name, overview, poster_path }) => ({
          show_id: id,
          name: name || title || '',
          overview,
          posterURL: poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : '',
        })
      );

      return searchResults;
    } catch (err) {
      console.error('TMDB API Error:', err);
      throw err;
    }
  }
}
