import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const { login } = useAuth();
  const [error, setError] = useState();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    setError("");
    if (!password || !email) {
      setError("Email ou mot de passe manquant.");
      return;
    }

    try {
      await login(email, password);
      alert("Bienvenue dans votre tableau de bord.");
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="login">
      <div className="loginContainer">
        <h1>Connexion</h1>
        {error && <p className="error">{error}</p>}
        <form className="loginForm" onSubmit={handleSubmit}>
          {/*Documentation for the structure of the labels: https://fr.reactjs.org/docs/forms.html */}
          <label>
            Email
            <input type="email" id="email" name="email" placeholder="antoinedupont@groupomania.fr" ref={emailRef} required />
          </label>
          <label>
            Mot de passe
            <input type="password" id="password" placeholder="************" name="password" ref={passwordRef} required />
          </label>
          <input type="submit" className="submitButton" value="Se connecter" />
        </form>
        <p>
          Pas encore inscrit ? <Link to="/signup">Crée-toi un compte !</Link>
        </p>
      </div>
    </div>
  );
}
