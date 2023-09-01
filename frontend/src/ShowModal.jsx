import { useEffect, useState } from "react";
import Modal from "./Modal";
import PropTypes from "prop-types";
import axios from "axios";

export default function ShowModal({
  selectedShow,
  setSelectedShow,
  shows,
  setShows,
}) {
  const [show, setShow] = useState({});
  const [seasons, setSeasons] = useState(0);
  const [episodes, setEpisodes] = useState(0);

  const closeModal = () => {
    setSelectedShow(null);
  };

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

  useEffect(() => {
    if (!selectedShow) return;

    axios
      .get(`${import.meta.env.VITE_API_PATH || ""}/show/${selectedShow}`)
      .then((res) => {
        setShow(res.data);
        setSeasons(res.data.seasonsWatched);
        setEpisodes(res.data.episodesWatched);
      })
      .catch((err) => console.error(err));
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
                  setSelectedShow(null);
                }
              });
          }
        }}
      >
        Delete
      </button>

      <div className="show-controls">
        <div className="show-control">
          <h3>Seasons watched</h3>
          <div className="button-group">
            <button onClick={() => update("DEC", "SE")}>-</button>
            <p>{seasons}</p>
            <button onClick={() => update("INC", "SE")}>+</button>
          </div>
        </div>

        <div className="show-control">
          <h3>Episodes watched</h3>
          <div className="button-group">
            <button onClick={() => update("DEC", "EP")}>-</button>
            <p>{episodes}</p>
            <button onClick={() => update("INC", "EP")}>+</button>
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
  setSelectedShow: PropTypes.func.isRequired,
  shows: PropTypes.array.isRequired,
  setShows: PropTypes.func.isRequired,
};
