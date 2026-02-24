import "./Spinner.css";

const Spinner = ({ size = "md", color = "primary" }) => (
  <span className={`spinner spinner-${size} spinner-${color}`} role="status">
    <span className="sr-only">Loading…</span>
  </span>
);

export default Spinner;
