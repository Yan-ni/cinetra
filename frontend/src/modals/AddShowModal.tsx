import { debounce } from "lodash";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export default function AddShowModal({
  modalStatus,
  setModalStatus,
  shows,
  setShows,
  type,
}) {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const [show, setShow] = useState({
    show_id: "",
    name: "",
    overview: "",
    posterURL: "",
  });

  const handleSearchInput = debounce((value) => {
    setSearch(value);
  }, 600);

  const closeModal = () => {
    setModalStatus(false);
    setSearch("");
    setSearchResult([]);
    setShow({
      show_id: "",
      name: "",
      overview: "",
      posterURL: "",
    });
    document.querySelector("#searchInput").value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!show.name || !show.overview || !show.posterURL) {
      closeModal();
      return;
    }

    axios
      .post(`${import.meta.env.VITE_API_PATH || ""}/${type}`, show)
      .then((res) => {
        if (res.status === 201) setShows([res.data, ...shows]);
      })
      .catch((err) => {
        console.error(err.response.status);
        if (err.response.status === 409)
          alert(
            `the ${type} you're trying to add already exists in your list.`
          );
      })
      .finally(() => {
        closeModal();
      });
  };

  const filterAndMapSearchResult = (searchResult) => {
    const result = [];

    // Time complexity : O(n)
    searchResult.forEach(({ show_id, name, overview, posterURL }, index) => {
      if (
        name &&
        overview &&
        posterURL &&
        !shows.find((show) => show.show_id === show_id)
      )
        result.push(
          <div
            key={index}
            onClick={() => {
              setShow({
                show_id,
                name,
                overview,
                posterURL,
              });
              setSearch("");
            }}
          >
            <img src={posterURL} alt="" />
            <div>
              <p>{name}</p>
              <p>{overview}</p>
            </div>
          </div>
        );
    });

    return result;
  };

  useEffect(() => {
    if (search.length === 0) setSearchResult([]);
    else {
      axios
        .get(
          `${import.meta.env.VITE_API_PATH || ""}/search/${type}?q=${search}`
        )
        .then((res) => {
          if (res.status === 200) setSearchResult(res.data);
          else
            alert(
              "something went wrong! please refresh the page and try again or contact the developer. Thank you 😘"
            );
        });
    }
  }, [search, type]);

  return (
    // <Modal
    //   className={`${modalStatus ? "flex" : ""}`}
    //   close={() => closeModal()}
    // >
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="searchShow">search the {type} you want to add</label>
          <input
            id="searchInput"
            type="text"
            autoComplete="off"
            onChange={(e) => handleSearchInput(e.target.value)}
          />
          <div className="searchResult">
            {/* Time complexity : O(n) */}
            {searchResult && filterAndMapSearchResult(searchResult)}
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="name">name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={show.name}
            required
            readOnly
          />
        </div>

        <div className="input-group">
          <label htmlFor="overview">overview</label>
          <textarea
            id="overview"
            name="overview"
            rows="3"
            value={show.overview}
            required
            readOnly
          />
        </div>

        <div className="input-group">
          <label htmlFor="posterURL">poster URL</label>
          <input
            id="posterURL"
            name="posterURL"
            type="text"
            value={show.posterURL}
            required
            readOnly
          />
        </div>

        <div className="ml-auto w-fit-content">
          <button
            className="btn-secondary inline-block"
            type="button"
            onClick={() => closeModal()}
          >
            cancel
          </button>
          <button className="btn-primary inline-block ml-1" type="submit">
            Add
          </button>
        </div>
      </form>
    // </Modal>
  );
}

AddShowModal.propTypes = {
  modalStatus: PropTypes.bool.isRequired,
  setModalStatus: PropTypes.func.isRequired,
  shows: PropTypes.array.isRequired,
  setShows: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["show", "movie"]).isRequired,
};
