export interface Show {
  id: string;
  name: string;
  overview: string | null;
  posterURL: string | null;
  seasonsWatched: number;
  episodesWatched: number;
  completed: boolean;
  favorite: boolean;
  userId: string;
  showId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateShowDto {
  name: string;
  overview?: string;
  posterURL?: string;
  seasonsWatched?: number;
  episodesWatched?: number;
  completed?: boolean;
  favorite?: boolean;
  showId?: number;
}

export interface UpdateShowDto {
  name?: string;
  overview?: string;
  posterURL?: string;
  seasonsWatched?: number;
  episodesWatched?: number;
  completed?: boolean;
  favorite?: boolean;
  showId?: number;
}
