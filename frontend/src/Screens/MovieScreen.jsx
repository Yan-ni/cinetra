import { useState, useEffect } from "react";
import axios from "axios";

// components
import Movie from "../components/Movie";

// modals
import ShowModal from "../modals/ShowModal";
import AddShowModal from "../modals/AddShowModal";

function ShowScreen() {
  const [addMovieModalStatus, setAddMovieModalStatus] = useState(false);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [search, setSearch] = useState("");

  const toggleFavorite = async (_id, favorite) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_PATH || ""}/movie/${_id}`, {
        favorite: !favorite,
      });

      // TODO: check response status
      setMovies(
        movies.map((movie) => {
          if (movie._id !== _id) return movie;

          return { ...movie, favorite: !favorite };
        })
      );
    } catch (error) {
      console.error("error occured while toggling show favorite button");
      if (import.meta.env.DEV) console.error(error);
    }
  };

  useEffect(() => {
    const loadShows = async () => {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_API_PATH || ""}/movie`
        );

        if (result.status === 200 && Array.isArray(result.data))
          setMovies(result.data);
      } catch (error) {
        console.error("error occured loading shows");
        if (import.meta.env.DEV) console.error(error);
      }
    };

    loadShows();
  }, []);

  return (
    <div className="app">
      <h1 className="text-align-center">Movie List</h1>

      <input
        type="text"
        name="search"
        placeholder="search for a movie in your list"
        value={search}
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
      />

      <button
        className="btn-primary"
        onClick={() => setAddMovieModalStatus(true)}
      >
        Add a movie
      </button>
      <AddShowModal
        type="movie"
        modalStatus={addMovieModalStatus}
        setModalStatus={setAddMovieModalStatus}
        shows={movies}
        setShows={setMovies}
      />

      <div className="shows w-100 gap-1 mt-1">
        {movies
          ?.filter((movie) => movie.name.toLowerCase().includes(search))
          .map((movie) => (
            <Movie
              key={movie._id}
              {...movie}
              toggleFavorite={toggleFavorite}
              setSelectedMovie={setSelectedMovie}
            />
          ))}
      </div>

      <ShowModal
        type="movie"
        selectedShow={selectedMovie}
        closeModal={() => setSelectedMovie(null)}
        shows={movies}
        setShows={setMovies}
      />
    </div>
  );
}

export default ShowScreen;
