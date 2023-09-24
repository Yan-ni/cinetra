import PropTypes from "prop-types";

export default function Modal({ children, className, close, style }) {
  return (
    <div
      className={`modal-background ${className}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="modal" style={style}>
        {children}
      </div>
    </div>
  );
}

Modal.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  close: PropTypes.func,
  style: PropTypes.object,
};
