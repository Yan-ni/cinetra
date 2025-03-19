import PropTypes from "prop-types";
import { Button } from "./ui/button";

export default function ShowControl({ name, active, update, count, children }) {
  return (
    <div className="flex flex-col">
      <h3 className="text-center text-l font-bold mb-3">{children}</h3>
      <div className="button-group flex self-center items-center gap-2">
        {active && (
          <Button className="rounded-full" name={name} onClick={update}>
            -
          </Button>
        )}
        <p>{count}</p>
        {active && (
          <Button className="rounded-full" name={name} onClick={update}>
            +
          </Button>
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
