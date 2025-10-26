import { Request, Response } from "express";
import Show from "../models/Show";

export default {
  put: async (req: Request, res: Response) => {
    /** We allow an update on the following fields :
     * seasonsWatched
     * episodesWatched
     * favorite
     * completed
     */
    const showId = req.params.id;
    const { body } = req;

    if (!showId || !body) res.sendStatus(204);

    try {
      const show = await Show.findOne({ _id: showId });

      if (!show) {
        res.sendStatus(404);
        return;
      }

      if (show.user_id !== req.user.id) {
        res.sendStatus(403);
        return;
      }

      if (Number.isInteger(body.seasonsWatched))
        show.seasonsWatched = body.seasonsWatched;

      if (Number.isInteger(body.episodesWatched))
        show.episodesWatched = body.episodesWatched;

      if (typeof body.favorite === "boolean") show.favorite = body.favorite;

      if (typeof body.completed === "boolean") show.completed = body.completed;

      await show.save();
      res.json(show);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  },
  delete: async (req: Request, res: Response) => {
    const showId = req.params.id;

    if (!showId) res.sendStatus(400);

    try {
      const show = await Show.findById(showId);

      if (show?.user_id !== req.user?.id) {
        res.sendStatus(403);
        return;
      }

      await Show.deleteOne({ _id: showId });
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  },
};
