export interface ShowRepository {
  findById(showId: string, userId: string): Promise<any>;
  findAll(userId: string): Promise<any[]>;
  create(showData: any, userId: string): Promise<any>;
}