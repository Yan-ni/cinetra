import PropTypes from "prop-types";

export default function ShowControl({ name, active, update, count, children }) {
  return (
    <div className="flex flex-column">
      <h3 className="text-align-center">{children}</h3>
      <div className="button-group align-self-center flex align-items-center gap-2">
        {active && (
          <button className="btn-primary" name={name} onClick={update}>
            -
          </button>
        )}
        <p>{count}</p>
        {active && (
          <button className="btn-primary" name={name} onClick={update}>
            +
          </button>
        )}
      </div>
    </div>
  );
}

ShowControl.propTypes = {
  name: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  update: PropTypes.func.isRequired,
  count: PropTypes.number,
  children: PropTypes.string.isRequired,
};
