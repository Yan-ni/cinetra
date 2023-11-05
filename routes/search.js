const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");

router.get("/search/show", verifyToken, async (req, res) => {
  const query = req.query.q;

  if (!query || query.length === 0) return res.json([]);

  const Authorization = process.env.API_AUTHORIZATION;
  try {
    let response = await fetch(
      `https://api.themoviedb.org/3/search/tv?query=${query}`,
      { headers: { Authorization } }
    );
    if (response.status !== 200) res.sendStatus(500);

    response = await response.json();

    response = response.results.map(({ id, name, overview, poster_path }) => ({
      show_id: id,
      name,
      overview,
      posterURL: `https://image.tmdb.org/t/p/w500${poster_path}`,
    }));

    res.json(response);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get("/search/movie", verifyToken, async (req, res) => {
  const query = req.query.q;

  if (!query || query.length === 0) return res.json([]);

  const Authorization = process.env.API_AUTHORIZATION;
  try {
    let response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${query}`,
      { headers: { Authorization } }
    );
    if (response.status !== 200) res.sendStatus(500);

    response = await response.json();

    response = response.results.map(({ id, title, overview, poster_path }) => ({
      show_id: id,
      name: title,
      overview,
      posterURL: `https://image.tmdb.org/t/p/w500${poster_path}`,
    }));

    res.json(response);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;
