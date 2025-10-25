import { GetAllCommand } from "./use-cases/get-all-command/get-all.command";
import { CreateCommand } from "./use-cases/create-command/create.command";
import { GetByEmailQuery } from "./use-cases/get-by-email-query/get-by-email.query";
import { UserPrismaRepository } from "./infra/user-prisma.repository";
import { GetByIdQuery } from "./use-cases/get-by-id-query/get-by-id.query";

const userRepo = new UserPrismaRepository();

export const userModule = {
  Queries: {
    GetByEmailQuery: new GetByEmailQuery(userRepo),
    GetByIdQuery: new GetByIdQuery(userRepo),
  },
  Commands: {
    GetAllCommand: new GetAllCommand(userRepo),
    CreateCommand: new CreateCommand(userRepo),
  }
}
