import { TMDBService } from '../../../../services/tmdb/tmdb.service';

export class SearchQuery {
  private tmdbService: TMDBService;

  constructor(tmdbService: TMDBService) {
    this.tmdbService = tmdbService;
  }

  async execute(query: string) {
    return await this.tmdbService.searchShows(query);
  }
}
