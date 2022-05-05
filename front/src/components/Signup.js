import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Signup.css";

export default function Signup() {
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordConfirmRef = useRef(null);
  const { signup } = useAuth();
  const [error, setError] = useState();
  const navigate = useNavigate();

  // To signup
  async function handleSubmit(event) {
    event.preventDefault();

    const username = usernameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const passwordConfirm = passwordConfirmRef.current.value;

    if (password !== passwordConfirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setError("");
      await signup(username, email, password);
      alert("Compte créé avec succès, veuillez maintenant vous connecter pour accéder à votre tableau de bord.");
      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="signup">
      <div className="signupContainer">
        <h1>Inscription</h1>
        {error && <p className="error">{error}</p>}
        <form className="signupForm" onSubmit={handleSubmit}>
          {/*Documentation for the structure of the labels: https://fr.reactjs.org/docs/forms.html */}
          <label>
            Pseudo*
            <input type="text" id="username" name="username" placeholder="Antoine D" ref={usernameRef} required />
          </label>
          <label>
            Email*
            <input type="email" id="email" name="email" placeholder="antoinedupont@groupomania.fr" ref={emailRef} required />
          </label>
          <label>
            Mot de passe*
            <input type="password" id="password" placeholder="************" name="password" ref={passwordRef} required />
          </label>
          <label>
            Confirmation du mot de passe*
            <input
              type="password"
              id="passwordConfirm"
              placeholder="************"
              name="passwordConfirm"
              ref={passwordConfirmRef}
              required
            />
          </label>
          <input type="submit" className="submitButton" value="Créer un compte" />
        </form>
        <p>
          Déjà inscrit ? <Link to="/login">Connecte-toi !</Link>
        </p>
      </div>
    </div>
  );
}
