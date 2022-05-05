import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Logout.css";

export default function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // To logout
  async function handleLogout(event) {
    event.preventDefault();
    try {
      await logout();
      alert("Déconnexion effectuée avec succès.");
      navigate("/");
    } catch (error) {
      console.log("Problème de déconnexion : ", error);
    }
  }

  return (
    <div className="logout">
      <div className="logoutContainer">
        <h1>Déconnexion</h1>
        <p>Veux-tu vraiment te déconnecter ?</p>
        <form className="logoutForm" onSubmit={handleLogout}>
          <input type="submit" className="submitButton" value="Déconnection" />
        </form>
      </div>
    </div>
  );
}
