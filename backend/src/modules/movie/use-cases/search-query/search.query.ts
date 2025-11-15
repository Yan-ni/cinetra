import { TMDBService, SearchResult } from '../../../../services/tmdb/tmdb.service';

export class SearchQuery {
  private tmdbService: TMDBService;

  constructor(tmdbService: TMDBService) {
    this.tmdbService = tmdbService;
  }

  async execute(query: string): Promise<SearchResult[]> {
    return await this.tmdbService.searchMovies(query);
  }
}
