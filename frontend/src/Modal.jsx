import PropTypes from "prop-types";

export default function Modal({ children, className }) {
  return (
    <div className={`modal-background ${className}`}>
      <div className="modal">{children}</div>
    </div>
  );
}

Modal.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
