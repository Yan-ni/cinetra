import PropTypes from "prop-types";

export default function Modal({ children, className, close }) {
  return (
    <div
      className={`modal-background ${className}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="modal">{children}</div>
    </div>
  );
}

Modal.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  close: PropTypes.func,
};
