import { ShowRepository } from "../model/show.repository";
import { PrismaClient } from '../../../../generated/prisma/client';

export class ShowPrismaRepository implements ShowRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findById(showId: string, userId: string): Promise<any> {
    const show = await this.prisma.show.findUnique({
      where: { id: showId, userId: userId }
    });
    return show;
  }

  async findAll(userId: string): Promise<any[]> {
    const shows = await this.prisma.show.findMany({
      where: { userId: userId }
    });
    return shows;
  }

  async create(showData: any, userId: string): Promise<any> {
    const newShow = await this.prisma.show.create({
      data: {...showData, userId: userId}
    });
    return newShow;
  }

  async delete(showId: string, userId: string): Promise<any> {
    const show = await this.prisma.show.deleteMany({
      where: { id: showId, userId: userId }
    });
    return show;
  }
}