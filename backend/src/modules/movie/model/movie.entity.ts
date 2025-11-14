export interface Movie {
  id: string;
  name: string;
  overview: string | null;
  posterURL: string | null;
  favorite: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMovieDto {
  name: string;
  overview?: string;
  posterURL?: string;
  favorite?: boolean;
}

export interface UpdateMovieDto {
  name?: string;
  overview?: string;
  posterURL?: string;
  favorite?: boolean;
}
