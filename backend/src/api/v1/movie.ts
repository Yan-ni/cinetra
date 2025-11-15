import { Router, Request, Response } from "express";
import { movieModule } from '../../modules/movie';
import { CreateMovieDto, UpdateMovieDto } from '../../modules/movie/model/movie.entity';

const router = Router();

router.get("/search", async (req: Request, res: Response) => {
  const query = req.query.q as string;
  
  try {
    const results = await movieModule.Queries.SearchQuery.execute(query);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", async (req: Request<{id: string}>, res: Response) => {
  const movieId = req.params.id;

  if (movieId) {
    const movie = await movieModule.Queries.GetByIdQuery.execute(movieId, req.user.id);
    
    if (!movie) {
      res.status(404).json({ message: "Movie not found" });
      return;
    }
    
    res.json(movie);
    return;
  }

  const movies = await movieModule.Queries.GetAllQuery.execute(req.user.id);
  res.json(movies);
});

router.get("/", async (req: Request, res: Response) => {
  const movies = await movieModule.Queries.GetAllQuery.execute(req.user.id);
  res.json(movies);
});

router.post("/", async (req: Request<{}, {}, CreateMovieDto>, res: Response) => {
  const movieData = req.body;
  
  try {
    const movie = await movieModule.Commands.CreateCommand.execute(movieData, req.user.id);
    res.status(201).json(movie);
  } catch (error) {
    if (error instanceof Error && error.message === 'Movie already exists') {
      res.status(409).json({ message: "Movie already exists" });
    } else {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

router.put("/:id", async (req: Request<{id: string}, {}, UpdateMovieDto>, res: Response) => {
  const movieId = req.params.id;
  const movieData = req.body;
  
  if (!movieId || !movieData) {
    res.status(400).json({ message: "Bad request" });
    return;
  }
  
  const result = await movieModule.Commands.UpdateCommand.execute(movieId, movieData, req.user.id);
  
  if (!result) {
    res.status(404).json({ message: "Movie not found or you don't have permission to update it" });
  } else {
    res.status(200).json(result);
  }
});

router.delete("/:id", async (req: Request<{id: string}>, res: Response) => {
  const movieId = req.params.id;
  
  if (!movieId) {
    res.status(400).json({ message: "Bad request" });
    return;
  }
  
  const result = await movieModule.Commands.DeleteCommand.execute(movieId, req.user.id);
  
  if (result.count === 0) {
    res.status(404).json({ message: "Movie not found or you don't have permission to delete it" });
  } else {
    res.status(200).json({ message: "Movie deleted successfully", result });
  }
});

export default router;
