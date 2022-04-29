import React, { useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import "../styles/EditProfile.css";

export default function EditProfile() {
  const { currentUser } = useAuth();

  const usernameRef = useRef();
  const emailRef = useRef();

  function handleUpdateUsername(event) {
    currentUser.user.username = usernameRef.current.value;
    console.log(currentUser.user.username);
  }

  function handleUpdateEmail(event) {
    currentUser.user.email = emailRef.current.value;
  }

  return (
    <div className="profile">
      <h2>Informations de profil</h2>
      <div className="profileInfos">
        <form className="profileForm">
          <label>
            Pseudo*
            <input
              type="text"
              id="username"
              name="username"
              placeholder={currentUser.user.username}
              ref={usernameRef}
              required
              onChange={handleUpdateUsername}
            />
          </label>
          <label>
            Email*
            <input
              type="email"
              id="email"
              name="email"
              value={currentUser.user.email}
              ref={emailRef}
              required
              onChange={handleUpdateEmail}
            />
          </label>
        </form>
      </div>
    </div>
  );
}
