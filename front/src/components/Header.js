import logo from "../assets/icon-logo-and-name.svg";
import "../styles/Header.css";

export default function Header() {
  return (
    <div>
      <img src={logo} alt="Grouponamia" className="logo"></img>
    </div>
  );
}
