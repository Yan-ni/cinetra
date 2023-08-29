import PropTypes from "prop-types";

// import axios from "axios";
// import { useState } from "react";

export default function Show({ name, posterURL }) {
  return (
    <div className="show">
      <img src={posterURL} alt="show image" />
      <h2>{name}</h2>
    </div>
  );
}

Show.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  overview: PropTypes.string.isRequired,
  posterURL: PropTypes.string.isRequired,
  seasonsWatched: PropTypes.number.isRequired,
  episodesWatched: PropTypes.number.isRequired,
  shows: PropTypes.array.isRequired,
  setShows: PropTypes.func.isRequired,
};
