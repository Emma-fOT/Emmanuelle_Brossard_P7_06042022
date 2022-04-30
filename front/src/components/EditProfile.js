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

  return (
    <div className="profile">
      <h2>Informations de profil</h2>
      <div className="profileInfos">
        <form className="profileForm">
          <label>
            Pseudo*
            <input type="text" id="username" name="username" defaultValue={props.usernameInput} required onChange={handleUsernameChange} />
          </label>
          <label>
            Email*
            <input type="email" id="email" name="email" defaultValue={props.emailInput} required onChange={handleEmailChange} />
          </label>
        </form>
      </div>
    </div>
  );
}
