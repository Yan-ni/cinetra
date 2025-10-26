import { UserRepository } from '../model/user.repository';
import { PrismaClient } from '../../../../generated/prisma/client';

export class UserPrismaRepository implements UserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(): Promise<any[]> {
    return this.prisma.user.findMany();
  }

  async findById(id: string): Promise<any | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<any | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: any): Promise<any> {
    return this.prisma.user.create({
      data,
    });
  }

  async update(id: string, data: any): Promise<any> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}