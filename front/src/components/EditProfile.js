import React from "react";
import "../styles/EditProfile.css";

export default function EditProfile(props) {
  //Lifting up state
  //See Dashboard.js to read the documentation about it
  function handleUsernameChange(e) {
    props.onUsernameChange(e.target.value);
  }

  function handleEmailChange(e) {
    props.onEmailChange(e.target.value);
  }

  function handleCurrentPasswordChange(e) {
    props.onCurrentPasswordChange(e.target.value);
  }
  function handleNewPasswordChange(e) {
    props.onNewPasswordChange(e.target.value);
  }
  function handleNewPasswordConfirmChange(e) {
    props.onNewPasswordConfirmChange(e.target.value);
  }
  return (
    <div className="profile">
      <h2>Informations de profil</h2>
      {props.error && <p className="error">{props.error}</p>}
      <div className="profileInfos">
        <form className="profileForm">
          <label>
            Pseudo
            <input type="text" id="username" name="username" defaultValue={props.usernameInput} required onChange={handleUsernameChange} />
          </label>
          <label>
            Email
            <input type="email" id="email" name="email" defaultValue={props.emailInput} required onChange={handleEmailChange} />
          </label>
          <label>
            Mot de passe actuel
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              placeholder="************"
              onChange={handleCurrentPasswordChange}
            />
          </label>
          <label>
            Nouveau mot de passe
            <input type="password" id="newPassword" name="newPassword" placeholder="************" onChange={handleNewPasswordChange} />
          </label>
          <label>
            Confirmation nouveau mot de passe
            <input
              type="password"
              id="newPasswordConfirm"
              name="newPasswordConfirm"
              placeholder="************"
              onChange={handleNewPasswordConfirmChange}
            />
          </label>
        </form>
      </div>
    </div>
  );
}
