import React from "react";
import Navbar from "./Navbar";
import logo from "../assets/icone-groupomania-logo-nom.png";
import "../styles/Header.css";

export default function Header() {
  return (
    <header className="header">
      <a href="../">
        <img src={logo} alt="Grouponamia" className="header_logo"></img>
      </a>
      <Navbar />
    </header>
  );
}
