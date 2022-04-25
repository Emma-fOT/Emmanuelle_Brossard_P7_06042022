import React from "react";
import { Link } from "react-router-dom";
import "../styles/Newpost.css";

export default function Newpost() {
  return (
    <div className="newpost">
      <h2>Envie de partager du contenu avec tes collègues ?</h2>
      <p>
        <Link to="/Newpost">Nouveau</Link>
      </p>
    </div>
  );
}
