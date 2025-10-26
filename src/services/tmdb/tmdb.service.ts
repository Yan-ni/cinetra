export interface SearchResult {
  show_id: string;
  name: string;
  overview: string;
  posterURL: string;
}

export interface TMDBService {
  searchShows(query: string): Promise<SearchResult[]>;
  searchMovies(query: string): Promise<SearchResult[]>;
}
