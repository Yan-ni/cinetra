import { Show, CreateShowDto, UpdateShowDto } from './show.entity';

export interface ShowRepository {
  findById(showId: string, userId: string): Promise<Show | null>;
  findAll(userId: string): Promise<Show[]>;
  create(showData: CreateShowDto, userId: string): Promise<Show>;
  update(showId: string, showData: UpdateShowDto, userId: string): Promise<Show | null>;
  delete(showId: string, userId: string): Promise<{ count: number }>;
}