import logo from "../assets/icone-groupomania-logo-nom.png";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <img src={logo} alt="Grouponamia" className="footer_logo"></img>
      <p> Développé par Emma, étudiante OpenClassRooms</p>
    </footer>
  );
}
