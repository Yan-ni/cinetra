export interface ShowRepository {
  findById(showId: string, userId: string): Promise<any>;
  findAll(userId: string): Promise<any[]>;
  create(showData: any, userId: string): Promise<any>;
  update(showId: string, showData: any, userId: string): Promise<any>;
  delete(showId: string, userId: string): Promise<any>;
}