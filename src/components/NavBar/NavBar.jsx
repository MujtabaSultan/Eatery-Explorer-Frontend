import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = ({ user, handleSignout }) => {
  return (
    <div className="navbar-container">
      {user ? (
        <nav className="navbar-nav">
          <div className="navbar-links">
            <Link to="/" className="navbar-link">Home</Link>
            <Link to="/restaurants" className="navbar-link">View all Restaurants</Link>
            <Link onClick={handleSignout} to="/" className="navbar-link">Sign Out</Link>
            <Link to={`/restaurants/owner/${user.id}`} className="navbar-link">View My Restaurants</Link>
            <Link to="/restaurants/new" className="navbar-link">New Restaurant</Link>
          </div>
        </nav>
      ) : (
        <nav className="navbar-nav">
          <div className="navbar-links">
            <Link to="/signin" className="navbar-link">Sign In</Link>
            <Link to="/signup" className="navbar-link">Sign Up</Link>
          </div>
        </nav>
      )}
    </div>
  );
};

export default NavBar;
