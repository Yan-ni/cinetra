import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import PropTypes from "prop-types";
import axios from "axios";

export default function ShowModal({
  selectedMovie,
  closeModal,
  movies,
  setMovies,
}) {
  const [movie, setMovie] = useState({});
  const [overviewCollaplsed, setOverviewCollapsed] = useState(true);

  useEffect(() => {
    if (!selectedMovie) return;

    const loadMovie = async () => {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_API_PATH || ""}/movie/${selectedMovie}`
        );

        setMovie(result.data);
      } catch (error) {
        console.error("error occured loading the movie");
        if (import.meta.env.DEV) console.error(error);
      }
    };

    loadMovie();
  }, [selectedMovie]);

  return (
    <Modal
      className={`${selectedMovie ? "flex show-modal" : "show-modal"}`}
      close={closeModal}
    >
      <div className="show-img w-100">
        <img src={movie.posterURL} alt="show image" />
      </div>

      <h2>{movie.name}</h2>
      <p
        className={`overview ${overviewCollaplsed ? "line-clamp-2" : "inline"}`}
      >
        {movie.overview}{" "}
      </p>
      <a
        href=""
        onClick={(e) => {
          e.preventDefault();
          setOverviewCollapsed(!overviewCollaplsed);
        }}
      >
        read {overviewCollaplsed ? "more" : "less"}
      </a>

      <button
        className="btn-danger my-1 w-100"
        onClick={() => {
          if (window.confirm("are you sure you want to delete this movie ?")) {
            axios
              .delete(
                `${import.meta.env.VITE_API_PATH || ""}/movie/${selectedMovie}`
              )
              .then((res) => {
                if (res.status === 200) {
                  setMovies(
                    movies.filter((movie) => movie._id !== selectedMovie)
                  );
                  closeModal(null);
                }
              });
          }
        }}
      >
        Delete
      </button>

      <button
        className="btn-primary mt-2 ml-auto"
        onClick={() => {
          setOverviewCollapsed(true);
          closeModal();
        }}
      >
        close
      </button>
    </Modal>
  );
}

ShowModal.propTypes = {
  selectedMovie: PropTypes.number,
  closeModal: PropTypes.func.isRequired,
  movies: PropTypes.array.isRequired,
  setMovies: PropTypes.func.isRequired,
};
