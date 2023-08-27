import './App.css';

import AddShowModal from './AddShowModal';
import { useState, useEffect } from 'react';
import Show from './Show';

import axios from 'axios';

function App() {
  const [modalOpened, setModalOpened] = useState(false);
  const [shows, setShows] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_PATH}/show`).then((res) => {
      if (res.status === 200 && Array.isArray(res.data))
        setShows(res.data);
    });
  }, []);

  return (
    <div className="app">
      <h1>Show List</h1>

      <button onClick={() => setModalOpened(true)}>Add a show</button>
      <AddShowModal modalOpened={modalOpened} setModalOpened={(param) => setModalOpened(param)} shows={shows} setShows={setShows} />

      {shows?.map((show) => <Show key={show._id} id={show._id} name={show.name} overview={show.overview} posterURL={show.posterURL} seasonsWatched={show.seasonsWatched} episodesWatched={show.episodesWatched} shows={shows} setShows={setShows} />)}
    </div>
  )
}

export default App;
