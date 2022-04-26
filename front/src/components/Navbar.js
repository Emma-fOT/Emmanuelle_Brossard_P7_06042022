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
      <nav className="standardNavigation">
        {currentUser === undefined ? (
          <div className="navlink">
            {/*Documentation: https://reactrouter.com/docs/en/v6/api#navlink */}
            <NavLink to="/login">Se connecter</NavLink>
            <NavLink to="/signup">S'inscrire</NavLink>
          </div>
        ) : (
          <div className="navlink">
            <NavLink to="/logout">Se déconnecter</NavLink>
          </div>
        )}
      </nav>
      <nav className="mobileNavigation">
        {isMenuOpen ? (
          <>
            {closeMenuIcon}
            {currentUser === undefined ? (
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
