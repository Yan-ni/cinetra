import PropTypes from "prop-types";

export default function Show({ _id, name, posterURL, setSelectedShow }) {
  return (
    <div className="show" onClick={() => setSelectedShow(_id)}>
      <img src={posterURL} alt="show image" />
      <h2>{name}</h2>
    </div>
  );
}

Show.propTypes = {
  _id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  posterURL: PropTypes.string.isRequired,
  setSelectedShow: PropTypes.func.isRequired,
};
