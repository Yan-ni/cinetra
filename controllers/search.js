module.exports = {
  get: async (req, res) => {
    const type = (req.params.type === "tv" && "show") || req.params.type;
    const query = req.query.q;

    if (!query || query.length === 0) return res.json([]);
    if (type !== "show" && type !== "movie") return res.json([]);

    try {
      let response = await fetch(
        `https://api.themoviedb.org/3/search/${type}?query=${query}`,
        { headers: { Authorization: process.env.API_AUTHORIZATION } }
      );
      if (response.status !== 200)
        throw new Error(
          `movie API responded with status code ${response.status}`
        );

      response = await response.json();

      response = response.results.map(
        ({ id, name, overview, poster_path }) => ({
          show_id: id,
          name,
          overview,
          posterURL: `https://image.tmdb.org/t/p/w500${poster_path}`,
        })
      );

      res.json(response);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  },
};
