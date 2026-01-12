import "./AppBar.css";
import { List, Search } from 'react-bootstrap-icons';

function AppBar() {
  return (
    <>
      <button
        onClick={() => {
          console.log("menu");
        }}
        className="btn-appbar btn-menu"
      >
       <List></List> 
      </button>
      <h1>EVITA</h1>
      <button
        onClick={() => {
          console.log("search");
        }}
        className="btn-appbar btn-search"
      >
        <Search></Search>
      </button>
    </>
  );
}

export default AppBar;
