export interface ShowType {
    id: string;
    name: string;
    overview: string;
    posterURL: string;
    seasonsWatched: number;
    episodesWatched: number;
    completed: boolean;
    favorite: boolean;
    userId: string;
    showId: number;
    createdAt: string;
    updatedAt: string;
}

export interface MovieType {
    id: string;
    name: string;
    overview?: string;
    posterURL?: string;
    favorite: boolean;
    userId: string;
    showId?: number;
    createdAt: string;
    updatedAt: string;
}

export interface UserType {
    id: string;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}
