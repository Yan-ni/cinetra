import { Request, Response } from "express";
import Movie from "../models/Movie";

export default {
  get: async (req: Request, res: Response) => {
    const movieId = req.params.id;
    try {
      if (movieId) {
        const movie = await Movie.findOne({
          _id: movieId,
          user_id: req.user?.id,
        });
        res.json(movie);
      } else {
        const movie = await Movie.find({ user_id: req.user?.id }).sort({
          updatedAt: -1,
        });
        res.json(movie);
      }
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  },
  post: async (req: Request, res: Response) => {
    try {
      const exists = await Movie.findOne({
        show_id: req.body?.show_id,
        user_id: req.user?.id,
      });

      if (exists) {
        res.sendStatus(409);
      } else {
        const movie = await Movie.create({ ...req.body, user_id: req.user.id });

        res.status(201).json(movie);
      }
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  },
  put: async (req: Request, res: Response) => {
    const movieId = req.params.id;
    const { body } = req;

    if (!movieId || !body) res.sendStatus(204);

    try {
      const movie = await Movie.findOne({ _id: movieId, user_id: req.user.id });

      if (!movie) {
        res.sendStatus(204);
        return;
      }

      if (typeof body.favorite === "boolean") movie.favorite = body.favorite;

      await movie.save();
      res.json(movie);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  },
  delete: async (req: Request, res: Response) => {
    const movieId = req.params.id;

    if (!movieId) res.sendStatus(400);

    try {
      const movie = await Movie.findById(movieId);

      if (movie?.user_id !== req.user.id) {
        res.sendStatus(403);
        return;
      }

      await Movie.deleteOne({ _id: movieId });
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  },
};
