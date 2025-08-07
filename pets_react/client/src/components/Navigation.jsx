import { Link } from 'react-router-dom';
import '../App.css';  // Use global styles

function NavBar() {
  return (
    <nav className="navbar">
      <h2 className="navbar-title">Pet Care App</h2>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/add">Add Pet</Link>
      </div>
    </nav>
  );
}

export default NavBar;