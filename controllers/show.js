const Show = require("../models/Show");

module.exports = {
  get: async (req, res) => {
    const showId = req.params.id;
    try {
      if (showId) {
        const show = await Show.findOne({
          _id: showId,
          user_id: req.user.id,
        });

        res.json(show);
      } else {
        const shows = await Show.find({ user_id: req.user.id }).sort({
          updatedAt: -1,
        });
        res.json(shows);
      }
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  },
  post: async (req, res) => {
    try {
      const exists = await Show.findOne({
        show_id: req.body?.show_id,
        user_id: req.user.id,
      });

      if (exists) {
        res.sendStatus(409);
      } else {
        const show = await Show.create({ ...req.body, user_id: req.user.id });

        res.status(201).json(show);
      }
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  },
  put: async (req, res) => {
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

      if (!show) return res.sendStatus(404);

      if (show.user_id !== req.user.id) return res.sendStatus(403);

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
  delete: async (req, res) => {
    const showId = req.params.id;

    if (!showId) res.sendStatus(400);

    try {
      const show = await Show.findById(showId);

      if (show.user_id !== req.user.id) return res.sendStatus(403);

      await Show.deleteOne({ _id: showId });
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  },
};
