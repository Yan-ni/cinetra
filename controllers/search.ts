import { Request, Response } from "express";

interface SearchResultType {
  show_id: string,
  name: string,
  overview: string,
  posterURL: string,
}

interface ApiResponse {
  results: Array<{
    id: string,
    title: string,
    name: string,
    overview: string,
    poster_path: string
  }>;
}

export default {
  get: async (req: Request, res: Response) => {
    const type = (req.params.type === "show" && "tv") || req.params.type;
    const query = req.query.q;

    if (!query || query.length === 0) {
      res.json([]);
      return;
    }

    if (type !== "tv" && type !== "movie") {
      res.json([]);
      return;
    }

    try {
      let response = await fetch(
        `https://api.themoviedb.org/3/search/${type}?query=${query}`,
        { headers: { Authorization: process.env.API_AUTHORIZATION || "" } }
      );
      if (response.status !== 200)
        throw new Error(
          `movie API responded with status code ${response.status}`
        );

      const responseJson: ApiResponse = await response.json() as ApiResponse;

      const searchResult: Array<SearchResultType> = responseJson.results.map<SearchResultType>(
        ({ id, title, name, overview, poster_path }) => ({
          show_id: id,
          name: name || title,
          overview,
          posterURL: `https://image.tmdb.org/t/p/w500${poster_path}`,
        })
      );

      res.json(searchResult);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  },
};
