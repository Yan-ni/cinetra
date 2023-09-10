import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import PropTypes from "prop-types";
import axios from "axios";

export default function ShowModal({
  selectedShow,
  closeModal,
  shows,
  setShows,
}) {
  const [show, setShow] = useState({});
  // TODO : use only one state for show
  const [seasons, setSeasons] = useState(0);
  const [episodes, setEpisodes] = useState(0);

  const update = async (op, type) => {
    const data = {};

    if (type === "SE") {
      data.seasonsWatched = seasons + (op === "DEC" ? -1 : 1);
    } else {
      data.episodesWatched = episodes + (op === "DEC" ? -1 : 1);
    }

    axios
      .put(`${import.meta.env.VITE_API_PATH || ""}/show/${selectedShow}`, data)
      .then((res) => {
        if (res.status === 200) {
          if (data.seasonsWatched) setSeasons(data.seasonsWatched);
          else if (data.episodesWatched) setEpisodes(data.episodesWatched);
        }
      });
  };

  const toggleComplete = async () => {
    try {
      await axios.get(
        `${import.meta.env.VITE_API_PATH || ""}/show/${selectedShow}/complete`
      );
      setShow({
        ...show,
        completed: !show.completed,
      });
    } catch (error) {
      console.error("something went wrong when setting the show as complete.");
      if (import.meta.env.DEV) console.error(error);
    }
  };

  useEffect(() => {
    if (!selectedShow) return;

    const loadShow = async () => {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_API_PATH || ""}/show/${selectedShow}`
        );

        setShow(result.data);
        setSeasons(result.data.seasonsWatched);
        setEpisodes(result.data.episodesWatched);
      } catch (error) {
        console.error("error occured loading the show");
        if (import.meta.env.DEV) console.error(error);
      }
    };

    loadShow();
  }, [selectedShow]);

  return (
    <Modal className={`${selectedShow ? "flex show-modal" : "show-modal"}`}>
      <div className="show-img">
        <img src={show.posterURL} alt="show image" />
      </div>

      <h2>{show.name}</h2>
      <p className="overview">{show.overview}</p>

      <button
        className="deleteShow"
        onClick={() => {
          if (window.confirm("are you sure you want to delete this show ?")) {
            axios
              .delete(
                `${import.meta.env.VITE_API_PATH || ""}/show/${selectedShow}`
              )
              .then((res) => {
                if (res.status === 200) {
                  setShows(shows.filter((show) => show._id !== selectedShow));
                  closeModal(null);
                }
              });
          }
        }}
      >
        Delete
      </button>

      <button className="completeShow" onClick={toggleComplete}>
        Mark as Complete
      </button>

      <div className="show-controls">
        <div className="show-control">
          <h3>Seasons watched</h3>
          <div className="button-group">
            {!show.completed && (
              <button onClick={() => update("DEC", "SE")}>-</button>
            )}
            <p>{seasons}</p>
            {!show.completed && (
              <button onClick={() => update("INC", "SE")}>+</button>
            )}
          </div>
        </div>

        <div className="show-control">
          <h3>Episodes watched</h3>
          <div className="button-group">
            {!show.completed && (
              <button onClick={() => update("DEC", "EP")}>-</button>
            )}
            <p>{episodes}</p>
            {!show.completed && (
              <button onClick={() => update("INC", "EP")}>+</button>
            )}
          </div>
        </div>
      </div>
      <button onClick={closeModal} className="close">
        close
      </button>
    </Modal>
  );
}

ShowModal.propTypes = {
  selectedShow: PropTypes.number,
  closeModal: PropTypes.func.isRequired,
  shows: PropTypes.array.isRequired,
  setShows: PropTypes.func.isRequired,
};
