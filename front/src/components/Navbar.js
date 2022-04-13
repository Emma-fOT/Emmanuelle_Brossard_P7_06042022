import { NavLink } from "react-router-dom";
import { useState } from "react";
import "../styles/Navbar.css";

export default function Header() {
  const [isLoggedIn, logIn] = useState(false);
  return (
    <nav>
      {!isLoggedIn ? (
        <div className="navlink">
          {/*https://reactrouter.com/docs/en/v6/api#navlink */}
          <NavLink to="/login">Se connecter</NavLink>
          <NavLink to="/signup">S'inscrire</NavLink>
        </div>
      ) : (
        <div className="navlink">
          <NavLink to="/logout">Se déconnecter</NavLink>
        </div>
      )}
    </nav>
  );
}
