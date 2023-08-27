import { debounce } from "lodash";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";


export default function AddShowModal({modalOpened, setModalOpened, shows, setShows}) {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  const [name, setName] = useState('');
  const [overview, setOverview] = useState('');
  const [posterURL, setPosterURL] = useState('');

  const handleChange = debounce(value => {
    setSearch(value);
  }, 600);

  const resetstates = () => {
    setSearch('');
    setSearchResult('');
    setName('');
    setOverview('');
    setPosterURL('');
  };

  useEffect(() => {
    if(search.length === 0)
      setSearchResult([]);
    else {
      const API_PATH = import.meta.env.VITE_API_PATH;
      axios.get(`${API_PATH ? API_PATH : ''}/search?q=${search}`).then((res) => {
        if(res.status === 200)
          setSearchResult(res.data);
        else
          alert('something went wrong! please refresh the page and try again or contact the developer. Thank you 😘');
      });
    }
  }, [search]);

  return (
    <div className={`modalBG ${modalOpened ? "show-modal" : ""}`}>
      <div className="modal">
        <form className="showModal-form" onSubmit={e => {
          e.preventDefault();
          axios.post(`${import.meta.env.VITE_API_PATH}/show`, {name, overview, posterURL}).then((res) => {
          if(res.status === 201)
            setShows([res.data, ...shows]);
          setModalOpened(false);
          resetstates();
          });
        }}>
          <div className="input-group">
            <label htmlFor="searchShow">search the show you want to add</label>
            <input type="text" onChange={e => handleChange(e.target.value)} />
            <div className="searchResult">
              {searchResult && searchResult.map((sr, i) => (
                <div key={i} onClick={() => {
                  setName(sr.name);
                  setOverview(sr.overview);
                  setPosterURL(`https://image.tmdb.org/t/p/w500${sr.posterURL}`);
                  setSearch('');
                }}>
                  <p>{sr.name}</p>
                  <p>{sr.overview.slice(0, 25)}...</p>
                </div>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="name">name</label>
            <input id="name" name="name" type="text" value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div className="input-group">
            <label htmlFor="overview">overview</label>
            <textarea id="overview" name="overview" rows="3" value={overview} onChange={e => setOverview(e.target.value)} required />
          </div>

          <div className="input-group">
            <label htmlFor="posterURL">poster URL</label>
            <input id="posterURL" name="posterURL" type="text" value={posterURL} onChange={e => setPosterURL(e.target.value)} required />
          </div>

          <div className="button-group">
            <button onClick={() => setModalOpened(false)}>cancel</button>
            <button type="submit">Add</button>
          </div>
        </form>
      </div>
    </div>
  )
}

AddShowModal.propTypes = {
  modalOpened: PropTypes.bool.isRequired,
  setModalOpened: PropTypes.func.isRequired,
  shows: PropTypes.array.isRequired,
  setShows: PropTypes.func.isRequired
}