const Loader = ({ size = "full" }) => {
  if (size === "full") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-sm text-text-muted">
        <div className="w-9 h-9 border-[3px] border-border border-t-accent rounded-full animate-spin" />
        <p>Loading...</p>
      </div>
    );
  }
  return <div className="inline-block w-5 h-5 border-[3px] border-border border-t-accent rounded-full animate-spin" />;
};

export default Loader;