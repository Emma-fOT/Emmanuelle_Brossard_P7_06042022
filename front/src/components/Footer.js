import logo from "../assets/icone-groupomania-logo-nom.png";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <div className="footer">
      <img src={logo} alt="Grouponamia" className="footer_logo"></img>
      <p> Développé par Emma, étudiante OpenClassRooms</p>
    </div>
  );
}