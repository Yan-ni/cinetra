import { debounce } from "lodash";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export default function AddShowModal({
  modalOpened,
  setModalOpened,
  shows,
  setShows,
}) {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const [_id, set_id] = useState("");
  const [name, setName] = useState("");
  const [overview, setOverview] = useState("");
  const [posterURL, setPosterURL] = useState("");

  const handleSearchInput = debounce((value) => {
    setSearch(value);
  }, 600);

  const resetstates = () => {
    setSearch("");
    setSearchResult("");
    set_id("");
    setName("");
    setOverview("");
    setPosterURL("");
  };

  useEffect(() => {
    if (search.length === 0) setSearchResult([]);
    else {
      axios
        .get(`${import.meta.env.VITE_API_PATH || ""}/search?q=${search}`)
        .then((res) => {
          if (res.status === 200) setSearchResult(res.data);
          else
            alert(
              "something went wrong! please refresh the page and try again or contact the developer. Thank you 😘"
            );
        });
    }
  }, [search]);

  return (
    <div className={`modalBG ${modalOpened ? "show-modal" : ""}`}>
      <div className="modal">
        <form
          className="showModal-form"
          onSubmit={(e) => {
            e.preventDefault();
            axios
              .post(`${import.meta.env.VITE_API_PATH || ""}/show`, {
                _id,
                name,
                overview,
                posterURL,
              })
              .then((res) => {
                if (res.status === 201) setShows([res.data, ...shows]);
              })
              .catch((err) => {
                console.error(err.response.status);
                if (err.response.status === 409)
                  alert(
                    "the show you're trying to add already exists in your list."
                  );
              })
              .finally(() => {
                setModalOpened(false);
                resetstates();
              });
          }}
        >
          <div className="input-group">
            <label htmlFor="searchShow">search the show you want to add</label>
            <input
              type="text"
              onChange={(e) => handleSearchInput(e.target.value)}
            />
            <div className="searchResult">
              {searchResult &&
                searchResult.map((sr, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      set_id(sr._id);
                      setName(sr.name);
                      setOverview(sr.overview);
                      setPosterURL(
                        `https://image.tmdb.org/t/p/w500${sr.posterURL}`
                      );
                      setSearch("");
                    }}
                  >
                    <p>{sr.name}</p>
                    <p>{sr.overview.slice(0, 25)}...</p>
                  </div>
                ))}
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="name">name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
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
              value={overview}
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
              value={posterURL}
              required
              readOnly
            />
          </div>

          <div className="button-group">
            <button onClick={() => setModalOpened(false)}>cancel</button>
            <button type="submit">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
}

AddShowModal.propTypes = {
  modalOpened: PropTypes.bool.isRequired,
  setModalOpened: PropTypes.func.isRequired,
  shows: PropTypes.array.isRequired,
  setShows: PropTypes.func.isRequired,
};
