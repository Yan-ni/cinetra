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
  const [overviewCollaplsed, setOverviewCollapsed] = useState(true);

  const update = async (op, type) => {
    const data = {};

    if (type === "SE") {
      data.seasonsWatched = show.seasonsWatched + (op === "DEC" ? -1 : 1);
    } else {
      data.episodesWatched = show.episodesWatched + (op === "DEC" ? -1 : 1);
    }

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_PATH || ""}/show/${selectedShow}`,
        data
      );
      if (res.status === 200) {
        if (data.seasonsWatched !== undefined)
          setShow((prev) => ({ ...prev, seasonsWatched: data.seasonsWatched }));
        else if (data.episodesWatched !== undefined)
          setShow((prev) => ({
            ...prev,
            episodesWatched: data.episodesWatched,
          }));
      }
    } catch (error) {
      console.error(
        "error occured when updating show's seasons count or episodes count"
      );
      if (import.meta.env.DEV) console.error(error);
    }
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
      } catch (error) {
        console.error("error occured loading the show");
        if (import.meta.env.DEV) console.error(error);
      }
    };

    loadShow();
  }, [selectedShow]);

  return (
    <Modal
      className={`${selectedShow ? "flex show-modal" : "show-modal"}`}
      close={closeModal}
    >
      <div className="show-img w-100">
        <img src={show.posterURL} alt="show image" />
      </div>

      <h2>{show.name}</h2>
      <p
        className={`overview ${overviewCollaplsed ? "line-clamp-2" : "inline"}`}
      >
        {show.overview}{" "}
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

      <button
        className={`w-100 ${show.completed ? "btn-success" : "btn-primary"}`}
        onClick={toggleComplete}
      >
        {show.completed ? "Show completed !" : "Mark as Complete"}
      </button>

      <div className="flex justify-content-space-between">
        <div className="flex flex-column">
          <h3 className="text-align-center">Seasons watched</h3>
          <div className="button-group align-self-center flex align-items-center gap-2">
            {!show.completed && (
              <button
                className="btn-primary"
                onClick={() => update("DEC", "SE")}
              >
                -
              </button>
            )}
            <p>{show.seasonsWatched}</p>
            {!show.completed && (
              <button
                className="btn-primary"
                onClick={() => update("INC", "SE")}
              >
                +
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-column">
          <h3 className="text-align-center">Episodes watched</h3>
          <div className="button-group align-self-center flex align-items-center gap-2">
            {!show.completed && (
              <button
                className="btn-primary"
                onClick={() => update("DEC", "EP")}
              >
                -
              </button>
            )}
            <p>{show.episodesWatched}</p>
            {!show.completed && (
              <button
                className="btn-primary"
                onClick={() => update("INC", "EP")}
              >
                +
              </button>
            )}
          </div>
        </div>
      </div>
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
  selectedShow: PropTypes.number,
  closeModal: PropTypes.func.isRequired,
  shows: PropTypes.array.isRequired,
  setShows: PropTypes.func.isRequired,
};
