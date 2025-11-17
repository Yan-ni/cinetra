import { GetByIdQuery } from './use-cases/get-by-id-query/get-by-id.query';
import { GetAllQuery } from './use-cases/get-all-query/get-all.query';
import { SearchQuery } from './use-cases/search-query/search.query';
import { ShowPrismaRepository } from './infra/show-prisma.repository';
import { CreateCommand } from './use-cases/create-command/create.command';
import { UpdateCommand } from './use-cases/update-command/update.command';
import { DeleteCommand } from './use-cases/delete-command/delete.command';
import { TMDBApiService } from '../../services/tmdb/tmdb-api.service';

const showRepository = new ShowPrismaRepository();
const tmdbService = new TMDBApiService();

export const showModule = {
  Queries: {
    GetByIdQuery: new GetByIdQuery(showRepository),
    GetAllQuery: new GetAllQuery(showRepository),
    SearchQuery: new SearchQuery(tmdbService)
  },
  Commands: {
    CreateCommand: new CreateCommand(showRepository),
    UpdateCommand: new UpdateCommand(showRepository),
    DeleteCommand: new DeleteCommand(showRepository)
  }
}