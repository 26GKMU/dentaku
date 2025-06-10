function Display({ display, error }) {
  return (
    <div className="cDisplayArea">
      <div className="cMainDisplay">{display}</div>
      <div className="cErrorMessage">{error}</div>
    </div>
  );
}
export default Display;