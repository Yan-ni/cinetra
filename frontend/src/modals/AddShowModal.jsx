import { debounce } from "lodash";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Modal from "../components/Modal";

export default function AddShowModal({
  modalStatus,
  setModalStatus,
  shows,
  setShows,
}) {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const [show, setShow] = useState({
    _id: "",
    name: "",
    overview: "",
    posterURL: "",
  });

  const handleSearchInput = debounce((value) => {
    setSearch(value);
  }, 600);

  const resetstates = () => {
    setSearch("");
    setSearchResult("");
    setShow({
      _id: "",
      name: "",
      overview: "",
      posterURL: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!show.name || !show.overview || !show.posterURL) {
      setModalStatus(false);
      return;
    }

    axios
      .post(`${import.meta.env.VITE_API_PATH || ""}/show`, show)
      .then((res) => {
        if (res.status === 201) setShows([res.data, ...shows]);
      })
      .catch((err) => {
        console.error(err.response.status);
        if (err.response.status === 409)
          alert("the show you're trying to add already exists in your list.");
      })
      .finally(() => {
        setModalStatus(false);
        resetstates();
      });
  };

  useEffect(() => {
    if (search.length === 0) setSearchResult([]);
    else {
      axios
        .get(`${import.meta.env.VITE_API_PATH || ""}/search/show?q=${search}`)
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
    <Modal
      className={`${modalStatus ? "flex" : ""}`}
      close={() => setModalStatus(false)}
    >
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="searchShow">search the show you want to add</label>
          <input
            type="text"
            onChange={(e) => handleSearchInput(e.target.value)}
          />
          <div className="searchResult">
            {searchResult &&
              searchResult.map(({ _id, name, overview, posterURL }, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setShow({
                      _id,
                      name,
                      overview,
                      posterURL,
                    });
                    setSearch("");
                  }}
                >
                  <img src={posterURL} alt="poster img" />
                  <div>
                    <p>{name}</p>
                    <p>{overview}</p>
                  </div>
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
            onClick={() => setModalStatus(false)}
          >
            cancel
          </button>
          <button className="btn-primary inline-block ml-1" type="submit">
            Add
          </button>
        </div>
      </form>
    </Modal>
  );
}

AddShowModal.propTypes = {
  modalStatus: PropTypes.bool.isRequired,
  setModalStatus: PropTypes.func.isRequired,
  shows: PropTypes.array.isRequired,
  setShows: PropTypes.func.isRequired,
};
