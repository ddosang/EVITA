function AppBar() {
  return (
    <>
      <button
        onClick={() => {
          console.log("menu");
        }}
      >
        menu
      </button>
      <h1>EVITA</h1>
      <button
        onClick={() => {
          console.log("search");
        }}
      >
        search
      </button>
    </>
  );
}

export default AppBar;
