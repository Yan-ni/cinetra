import { GetByIdQuery } from './use-cases/get-by-id-query/get-by-id.query';
import { GetAllQuery } from './use-cases/get-all-query/get-all.query';
import { ShowPrismaRepository } from './infra/show-prisma.repository';
import { CreateCommand } from './use-cases/create-command/create.command';

const showRepository = new ShowPrismaRepository();

export const showModule = {
  Queries: {
    GetByIdQuery: new GetByIdQuery(showRepository),
    GetAllQuery: new GetAllQuery(showRepository)
  },
  Commands: {
    CreateCommand: new CreateCommand(showRepository)
  }
}