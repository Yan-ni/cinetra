import { GetByIdQuery } from './use-cases/get-by-id-query/get-by-id.query';
import { GetAllQuery } from './use-cases/get-all-query/get-all.query';
import { SearchQuery } from './use-cases/search-query/search.query';
import { MoviePrismaRepository } from './infra/movie-prisma.repository';
import { CreateCommand } from './use-cases/create-command/create.command';
import { UpdateCommand } from './use-cases/update-command/update.command';
import { DeleteCommand } from './use-cases/delete-command/delete.command';
import { TMDBApiService } from '../../services/tmdb/tmdb-api.service';

const movieRepository = new MoviePrismaRepository();
const tmdbService = new TMDBApiService();

export const movieModule = {
  Queries: {
    GetByIdQuery: new GetByIdQuery(movieRepository),
    GetAllQuery: new GetAllQuery(movieRepository),
    SearchQuery: new SearchQuery(tmdbService)
  },
  Commands: {
    CreateCommand: new CreateCommand(movieRepository),
    UpdateCommand: new UpdateCommand(movieRepository),
    DeleteCommand: new DeleteCommand(movieRepository)
  }
}
