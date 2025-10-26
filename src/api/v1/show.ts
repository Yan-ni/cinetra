import { Router, Request, Response } from "express";
import { showModule } from '../../modules/show';

const router = Router();

router.get("/{:id}", async (req: Request<{id: string}>, res: Response) => {
  console.log("GET /show/:id called");
  const showId = req.params.id;

  if (showId) {
    const show = await showModule.Queries.GetByIdQuery.execute(showId, req.user.id);
    res.json(show);
  }

  const shows = await showModule.Queries.GetAllQuery.execute(req.user.id);

  res.json(shows);
});

interface CreateShowDto {
  name: string;
  overview?: string;
  posterURL?: string;
  seasonsWatched?: number;
  episodesWatched?: number;
  completed?: boolean;
  favorite?: boolean;
  showId?: string;
}

router.post("/", async (req: Request<{}, {}, CreateShowDto>, res: Response) => {
  const showData = req.body;
  res.status(201).json(await showModule.Commands.CreateCommand.execute(showData, req.user.id));
});

router.delete("/:id", async (req: Request<{id: string}>, res: Response) => {
  const showId = req.params.id;
  const result = await showModule.Commands.DeleteCommand.execute(showId, req.user.id);
  
  if (result.count === 0) {
    res.status(404).json({ message: "Show not found or you don't have permission to delete it" });
  } else {
    res.status(200).json({ message: "Show deleted successfully", result });
  }
});


// router.put("/show/:id", protectedRoute, showController.put);
// router.delete("/show/:id", protectedRoute, showController.delete);

export default router;
