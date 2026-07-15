import "../styles/components.css";

const Loader = ({ size = "full" }) => {
  if (size === "full") {
    return (
      <div className="loader-full">
        <div className="loader-spinner" />
        <p>Loading...</p>
      </div>
    );
  }
  return <div className="loader-inline" />;
};

export default Loader;