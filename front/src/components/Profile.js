import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import "../styles/Profile.css";

export default function Profile() {
  const { currentUser } = useAuth();

  return (
    <div className="profile">
      <h2>Informations de profil</h2>
      <div className="profileInfos">
        <p>Nom : {currentUser.user.username}</p>
        <p>Email : {currentUser.user.email}</p>
        <p>Mot de passe : ************</p>
      </div>
      <p className="editProfile">
        <Link to="/editProfile">Modifier</Link>
      </p>
      <p className="editProfile">
        <Link to="/profileActivity">Historique</Link>
      </p>
    </div>
  );
}
