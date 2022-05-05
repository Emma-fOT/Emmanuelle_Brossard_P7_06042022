import React from "react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import "../styles/Navbar.css";
/*Documentation: https://react-icons.github.io/react-icons/ */
import { CgMenu } from "react-icons/cg";
import { CgClose } from "react-icons/cg";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const hamburgerMenuIcon = <CgMenu className="hamburger-btn" size="40px" color="rgb(255,0,0)" onClick={() => setMenuOpen(!isMenuOpen)} />;
  const closeMenuIcon = <CgClose className="hamburger-btn" size="40px" color="rgb(255,0,0)" onClick={() => setMenuOpen(!isMenuOpen)} />;
  const closeMobileMenu = () => setMenuOpen(false);
  const animateFrom = { opacity: 0, x: 800 };
  const animateTo = { opacity: 1, x: 0 };
  const { currentUser } = useAuth();

  return (
    <div className="navigation">
      {
        // The standard menu is only displayed on big screens
      }
      <nav className="standardNavigation">
        {currentUser === undefined || currentUser === null ? ( // currentUser is undefined at the beginning, and is null after logout
          // Menu to display if the user is not logged in
          <div className="navlink">
            {/*Documentation: https://reactrouter.com/docs/en/v6/api#navlink */}
            <NavLink to="/login">Se connecter</NavLink>
            <NavLink to="/signup">S'inscrire</NavLink>
          </div>
        ) : (
          // Menu to display if the user is logged in
          <div className="navlink">
            {currentUser.user.role === "admin" ? (
              <NavLink to="/admindashboard">Tableau d'administration</NavLink>
            ) : (
              <NavLink to="/dashboard">Tableau de bord</NavLink>
            )}
            <NavLink to="/logout">Se déconnecter</NavLink>
          </div>
        )}
      </nav>
      {
        // The hamburger menu is only displayed on mobile screens
      }
      <nav className="mobileNavigation">
        {isMenuOpen ? (
          <>
            {closeMenuIcon}
            {currentUser === undefined || currentUser === null ? (
              // Hamburger menu to display if the user is not logged in
              <motion.ul
                className="navlink"
                initial={animateFrom}
                animate={animateTo}
                transition={{ delay: 0, duration: 0.5 }}
                onClick={() => closeMobileMenu()}
              >
                <motion.li
                  initial={animateFrom}
                  animate={animateTo}
                  transition={{ delay: 0.05, duration: 0.5 }}
                  onClick={() => closeMobileMenu()}
                >
                  <a href="../login">Se connecter</a>
                </motion.li>
                <motion.li
                  initial={animateFrom}
                  animate={animateTo}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  onClick={() => closeMobileMenu()}
                >
                  <a href="../signup">S'inscrire</a>
                </motion.li>
              </motion.ul>
            ) : (
              // Hamburger menu to display if the user is logged in
              <motion.ul
                className="navlink"
                initial={animateFrom}
                animate={animateTo}
                transition={{ delay: 0.05, duration: 0.5 }}
                onClick={() => closeMobileMenu()}
              >
                <motion.li
                  initial={animateFrom}
                  animate={animateTo}
                  transition={{ delay: 0, duration: 0.5 }}
                  onClick={() => closeMobileMenu()}
                >
                  <a href="../dashboard">Tableau de bord</a>
                </motion.li>
                <motion.li
                  initial={animateFrom}
                  animate={animateTo}
                  transition={{ delay: 0, duration: 0.5 }}
                  onClick={() => closeMobileMenu()}
                >
                  <a href="../logout">Se déconnecter</a>
                </motion.li>
              </motion.ul>
            )}
          </>
        ) : (
          hamburgerMenuIcon
        )}
      </nav>
    </div>
  );
}
