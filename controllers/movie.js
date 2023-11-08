const Movie = require("../models/Movie");

module.exports = {
  get: async (req, res) => {
    const movieId = req.params.id;
    try {
      if (movieId) {
        const movie = await Movie.findOne({
          _id: movieId,
          user_id: req.user.id,
        });
        res.json(movie);
      } else {
        const movie = await Movie.find({ user_id: req.user.id }).sort({
          updatedAt: -1,
        });
        res.json(movie);
      }
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  },
  post: async (req, res) => {
    try {
      const exists = await Movie.findOne({
        show_id: req.body?.show_id,
        user_id: req.user.id,
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
  put: async (req, res) => {
    const movieId = req.params.id;
    const { body } = req;

    if (!movieId || !body) res.sendStatus(204);

    try {
      const movie = await Movie.findOne({ _id: movieId, user_id: req.user.id });

      if (!movie) return res.sendStatus(204);

      if (typeof body.favorite === "boolean") movie.favorite = body.favorite;

      await movie.save();
      res.json(movie);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  },
  delete: async (req, res) => {
    const movieId = req.params.id;

    if (!movieId) res.sendStatus(400);

    try {
      const movie = await Movie.findById(movieId);

      if (movie.user_id !== req.user.id) return res.sendStatus(403);

      await Movie.deleteOne({ _id: movieId });
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  },
};
