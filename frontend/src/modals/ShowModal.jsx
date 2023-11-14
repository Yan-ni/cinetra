import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import PropTypes from "prop-types";
import axios from "axios";
import ShowControl from "../components/ShowControl";

export default function ShowModal({
  selectedShow,
  closeModal,
  shows,
  setShows,
  type,
}) {
  const [show, setShow] = useState({});
  const [overviewCollaplsed, setOverviewCollapsed] = useState(true);

  const update = async (e) => {
    const data = {};
    const op = e.target.textContent;
    const type = e.target.name;

    if (type === "seasons") {
      data.seasonsWatched = show.seasonsWatched + (op === "-" ? -1 : 1);
    } else {
      data.episodesWatched = show.episodesWatched + (op === "-" ? -1 : 1);
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
      await axios.put(
        `${import.meta.env.VITE_API_PATH || ""}/show/${selectedShow}`,
        {
          completed: !show.completed,
        }
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
          `${import.meta.env.VITE_API_PATH || ""}/${type}/${selectedShow}`
        );

        setShow(result.data);
      } catch (error) {
        console.error(`error occured loading the ${type}`);
        if (import.meta.env.DEV) console.error(error);
      }
    };

    loadShow();
  }, [selectedShow, type]);

  return (
    <Modal
      className={`${selectedShow ? "flex show-modal" : "show-modal"}`}
      close={closeModal}
      style={{
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${show.posterURL}) center`,
      }}
    >
      <h2>{show.name}</h2>
      <p
        className={`overview ${overviewCollaplsed ? "line-clamp-3" : "inline"}`}
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
                `${import.meta.env.VITE_API_PATH || ""}/${type}/${selectedShow}`
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

      {type === "show" && (
        <>
          <button
            className={`w-100 ${
              show.completed ? "btn-success" : "btn-primary"
            }`}
            onClick={toggleComplete}
          >
            {show.completed ? "Show completed !" : "Mark as Complete"}
          </button>
          <div className="flex justify-content-space-between">
            <ShowControl
              name="seasons"
              count={show.seasonsWatched}
              active={!show.completed}
              update={update}
            >
              Seasons Watched
            </ShowControl>
            <ShowControl
              name="episodes"
              count={show.episodesWatched}
              active={!show.completed}
              update={update}
            >
              Episodes Watched
            </ShowControl>
          </div>
        </>
      )}

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
  selectedShow: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
  shows: PropTypes.array.isRequired,
  setShows: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["show", "movie"]).isRequired,
};
