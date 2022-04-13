import Navbar from "./Navbar";
import logo from "../assets/icon-logo-and-name.png";
import "../styles/Header.css";

export default function Header() {
  return (
    <div className="header">
      <a href="../">
        <img src={logo} alt="Grouponamia" className="header_logo"></img>
      </a>
      <Navbar />
    </div>
  );
}
