import { Link } from "react-router-dom";
import "./NavBar.css";
import { useEffect } from "react";
import authService from "../../services/authService";
import { useNavigate } from "react-router-dom";

const NavBar = ({ user, handleSignout, setUser }) => {
  const navigate = useNavigate();
  useEffect(() => {
    window.logInCallBack = async (response) => {
      try {
        const googleCredential = response.credential;
        const userData = await authService.googleAuth(googleCredential);
        console.log(userData);
        setUser(userData);
        navigate("/");
        window.location.reload();
      } catch (error) {
        console.error("Google login failed:", error);
      }
    };
    if (window.google && window.google.accounts) {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: window.logInCallBack,
        ux_mode: "popup",
      });

      if (!user) {
        window.google.accounts.id.renderButton(
          document.getElementById("googleSignInDiv"),
          {
            theme: "outline",
            size: "large",
            text: "signin_with",
            shape: "rectangular",
            logo_alignment: "left",
          }
        );
      }
    }
  }, [user]);

  return (
    <div className="navbar-container">
      {user ? (
        <nav className="navbar-nav">
          <div className="navbar-links">
            <Link to="/" className="navbar-link">
              Home
            </Link>
            <Link to="/restaurants" className="navbar-link">
              View all Restaurants
            </Link>
            <Link onClick={handleSignout} to="/" className="navbar-link">
              Sign Out
            </Link>
            <Link to={`/restaurants/owner/${user.id}`} className="navbar-link">
              View My Restaurants
            </Link>
            <Link to="/restaurants/new" className="navbar-link">
              New Restaurant
            </Link>
          </div>
        </nav>
      ) : (
        <nav className="navbar-nav">
          <div className="navbar-links">
            <Link to="/signin" className="navbar-link">
              Sign In
            </Link>
            <Link to="/signup" className="navbar-link">
              Sign Up
            </Link>
            <div id="googleSignInDiv"></div>
          </div>
        </nav>
      )}
    </div>
  );
};

export default NavBar;
