const router = require("express").Router();
const Movie = require("../models/Movie");

router.get("/movie/:id?", async (req, res) => {
  const movieId = req.params.id;
  try {
    if (movieId) {
      const movie = await Movie.findById(movieId);
      res.json(movie);
    } else {
      const movie = await Movie.find().sort({ updatedAt: -1 });
      res.json(movie);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post("/movie", async (req, res) => {
  try {
    const exists = await Movie.findById(req.body?._id);

    if (exists) {
      res.sendStatus(409);
    } else {
      const movie = await Movie.create(req.body);

      res.status(201).json(movie);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.put("/movie/:id", async (req, res) => {
  const movieId = req.params.id;
  const { body } = req;

  if (!movieId || !body) res.sendStatus(204);

  try {
    const movie = await Movie.findOne({ _id: movieId });

    if (!movie) return res.sendStatus(204);

    movie.favorite = body?.favorite || false;

    await movie.save();
    res.json(movie);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.delete("/movie/:id", async (req, res) => {
  const movieId = req.params.id;

  if (!movieId) res.sendStatus(400);

  try {
    await Movie.deleteOne({ _id: movieId });
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;
