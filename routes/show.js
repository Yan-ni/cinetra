const router = require("express").Router();
const Show = require("../models/Show");

router.get("/show/:id?", async (req, res) => {
  const showId = req.params.id;
  try {
    if (showId) {
      const show = await Show.findById(showId);
      res.json(show);
    } else {
      const shows = await Show.find().sort({ updatedAt: -1 });
      res.json(shows);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.get("/show/:id/complete", async (req, res) => {
  const showId = req.params.id;

  try {
    const show = await Show.findOne({ _id: showId });

    if (!show) return res.sendStatus(204);

    show.completed = !show.completed;

    await show.save();

    res.json(show);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post("/show", async (req, res) => {
  try {
    const exists = await Show.findById(req.body?._id);

    if (exists) {
      res.sendStatus(409);
    } else {
      const show = await Show.create(req.body);

      res.status(201).json(show);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.put("/show/:id", async (req, res) => {
  const showId = req.params.id;
  const { body } = req;

  if (!showId || !body) res.sendStatus(204);

  try {
    const show = await Show.findOne({ _id: showId });

    if (!show) return res.sendStatus(204);

    if (Number.isInteger(body.seasonsWatched))
      show.seasonsWatched = body.seasonsWatched;

    if (Number.isInteger(body.episodesWatched))
      show.episodesWatched = body.episodesWatched;

    if (typeof body.favorite === "boolean") show.favorite = body.favorite;

    await show.save();
    res.json(show);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.delete("/show/:id", async (req, res) => {
  const showId = req.params.id;

  if (!showId) res.sendStatus(400);

  try {
    await Show.deleteOne({ _id: showId });
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;
