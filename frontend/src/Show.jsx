import PropTypes from 'prop-types';

import axios from 'axios';
import { useState } from 'react';

export default function Show({ id, name, overview, posterURL, seasonsWatched, episodesWatched, shows, setShows }) {
  const [seasons, setSeasons] = useState(seasonsWatched);
  const [episodes, setEpisodes] = useState(episodesWatched);

  const update = async (id, op, type) => {
    const data = {};

    if(type === 'SE') {
      data.seasonsWatched = seasons + (op === 'DEC' ? -1 : 1);
    } else {
      data.episodesWatched = episodes + (op === 'DEC' ? -1 : 1);
    }

    axios.put(`${import.meta.env.VITE_API_PATH}/show/${id}`, data).then((res) => {
      if(res.status === 200) {
        if (data.seasonsWatched)
          setSeasons(data.seasonsWatched);
        else if (data.episodesWatched)
          setEpisodes(data.episodesWatched);
      }
    });
  } 

  return (
    <div className="show">
      <div className="show-img">
        <img src={posterURL} alt="show image" />
      </div>
      <div>
        <h2>{name}</h2>
        <p className="overview">{overview}</p>

        <div className="show-controls">
          <div className="show-control">
            <h3>Seasons watched</h3>
            <div className="button-group">
              <button onClick={() => update(id, 'DEC', 'SE')}>-</button>
              <p>{seasons}</p>
              <button onClick={() => update(id, 'INC', 'SE')}>+</button>
            </div>
          </div>

          <div className="show-control">
            <h3>Episodes watched</h3>
            <div className="button-group">
              <button onClick={() => update(id, 'DEC', 'EP')}>-</button>
              <p>{episodes}</p>
              <button onClick={() => update(id, 'INC', 'EP')}>+</button>
            </div>
          </div>
        </div>
        <button className="deleteShow" onClick={() => {
          if (window.confirm("are you sure you want to delete this show ?")) {
            axios.delete(`${import.meta.env.VITE_API_PATH}/show/${id}`).then(res => {
            if (res.status === 200) {
              setShows(shows.filter(show => show._id !== id));
            }
          });
          }
        }}>Delete</button>
      </div>

    </div>
  )
} 

Show.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  overview: PropTypes.string.isRequired,
  posterURL: PropTypes.string.isRequired,
  seasonsWatched: PropTypes.number.isRequired,
  episodesWatched: PropTypes.number.isRequired,
  shows: PropTypes.array.isRequired,
  setShows: PropTypes.func.isRequired
}
