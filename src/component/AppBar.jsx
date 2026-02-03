import { List, Search } from "react-bootstrap-icons";
import "./AppBar.css";
import "./Common.css";

function AppBar({ onMenuClick, onSearchClick }) {
  return (
    <header className="appbar" role="banner">
      <button
        onClick={() => {
          if (onMenuClick) onMenuClick();
        }}
        className="btn-appbar btn-menu"
        type="button"
        aria-label="Open menu"
      >
        <List></List>
      </button>
      <h1 className="heading_1">EVITA</h1>
      <button
        onClick={() => {
          if (onSearchClick) onSearchClick();
        }}
        className="btn-appbar btn-search"
        type="button"
        aria-label="Search"
      >
        <Search></Search>
      </button>
    </header>
  );
}

export default AppBar;
