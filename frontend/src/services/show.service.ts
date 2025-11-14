import { ApiService } from "./api.service";
import { ShowType } from "@/types";

interface CreateShowData {
  name: string;
  overview?: string;
  posterURL?: string;
  seasonsWatched?: number;
  episodesWatched?: number;
  completed?: boolean;
  favorite?: boolean;
  showId?: number;
}

interface UpdateShowData {
  name?: string;
  overview?: string;
  posterURL?: string;
  seasonsWatched?: number;
  episodesWatched?: number;
  completed?: boolean;
  favorite?: boolean;
  showId?: number;
}

interface ShowSearchResult {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  first_air_date: string;
}

class ShowServiceClass extends ApiService {
  async getAllShows(): Promise<ShowType[]> {
    const response = await this.get<ShowType[]>("/show");
    return response.data;
  }

  async getShowById(id: string): Promise<ShowType> {
    const response = await this.get<ShowType>(`/show/${id}`);
    return response.data;
  }

  async createShow(data: CreateShowData): Promise<ShowType> {
    const response = await this.post<ShowType>("/show", data);
    return response.data;
  }

  async updateShow(id: string, data: UpdateShowData): Promise<ShowType> {
    const response = await this.put<ShowType>(`/show/${id}`, data);
    return response.data;
  }

  async deleteShow(id: string): Promise<void> {
    await this.delete(`/show/${id}`);
  }

  async searchShows(query: string): Promise<ShowSearchResult[]> {
    const response = await this.get<ShowSearchResult[]>(`/show/search?q=${query}`);
    return response.data;
  }

  async toggleFavorite(id: string, favorite: boolean): Promise<ShowType> {
    const response = await this.put<ShowType>(`/show/${id}`, { favorite });
    return response.data;
  }

  async toggleCompleted(id: string, completed: boolean): Promise<ShowType> {
    const response = await this.put<ShowType>(`/show/${id}`, { completed });
    return response.data;
  }

  async updateSeasons(id: string, seasonsWatched: number): Promise<ShowType> {
    const response = await this.put<ShowType>(`/show/${id}`, { seasonsWatched });
    return response.data;
  }

  async updateEpisodes(id: string, episodesWatched: number): Promise<ShowType> {
    const response = await this.put<ShowType>(`/show/${id}`, { episodesWatched });
    return response.data;
  }
}

export const ShowService = new ShowServiceClass();
