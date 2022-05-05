import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Profile from "./Profile";
import EditProfile from "./EditProfile";
import Newpost from "./Newpost";
import Posts from "./Posts";
import DisplayPopup from "./DisplayPopup";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { currentUser, deleteProfile, updateProfile, updatePassword } = useAuth();
  const [postsList, setPostsList] = useState([]);
  const [profileEditing, setProfileEditing] = useState(false);
  const [displayDeletePopup, setDisplayDeletePopup] = useState(false);
  const [error, setError] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    // Get all posts of all users
    const url = "http://localhost:3000/api/posts";
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.token}`,
      },
    };
    fetch(url, options).then(
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            setPostsList(data);
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }, [currentUser]); // Add the currentUser to the dependencies array
  //Second argument is empty array because we don't want to allways re-render the component.
  //https://medium.com/programming-essentials/how-to-do-a-fetch-inside-react-components-7875a213da7e

  //Lifting state up
  //https://fr.reactjs.org/docs/lifting-state-up.html
  const [usernameInput, setUsernameInput] = useState(currentUser.user.username);
  const [emailInput, setEmailInput] = useState(currentUser.user.email);
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [newPasswordConfirmInput, setNewPasswordConfirmInput] = useState("");
  function handleUsernameChange(usernameInput) {
    setUsernameInput(usernameInput);
  }
  function handleEmailChange(emailInput) {
    setEmailInput(emailInput);
  }
  function handleCurrentPasswordChange(currentPasswordInput) {
    setCurrentPasswordInput(currentPasswordInput);
  }
  function handleNewPasswordChange(newPasswordInput) {
    setNewPasswordInput(newPasswordInput);
  }
  function handleNewPasswordConfirmChange(newPasswordConfirmInput) {
    setNewPasswordConfirmInput(newPasswordConfirmInput);
  }

  // To update the profile of the current user
  async function handleUpdateClick() {
    setError("");
    if (currentPasswordInput !== "") {
      if (newPasswordInput !== newPasswordConfirmInput) {
        return setError("Les mots de passe ne correspondent pas");
      } else {
        if (newPasswordInput !== "") {
          try {
            await updatePassword(currentPasswordInput, newPasswordInput);
          } catch (error) {
            return setError(error.message);
          }
        } else {
          return setError("Veuillez entrer un nouveau mot de passe");
        }
      }
    } else {
      if (newPasswordInput !== "") {
        return setError("Veuillez entrer votre mot de passe actuel");
      }
    }
    try {
      await updateProfile(usernameInput, emailInput);
      setProfileEditing(!profileEditing);
    } catch (error) {
      setError(error.message);
      setUsernameInput(currentUser.user.username);
      setEmailInput(currentUser.user.email);
      setCurrentPasswordInput("");
      setNewPasswordInput("");
      setNewPasswordConfirmInput("");
    }
  }

  // To manage the click on the "Modifier" or "Annuler" buttons
  function handleClick() {
    setProfileEditing(!profileEditing);
    setError("");
    setUsernameInput(currentUser.user.username);
    setEmailInput(currentUser.user.email);
    setCurrentPasswordInput("");
    setNewPasswordInput("");
    setNewPasswordConfirmInput("");
  }

  // To delete the profile of the current user
  async function handleDelete() {
    const userId = currentUser.user.userId;
    const token = currentUser.token;
    try {
      await deleteProfile(userId, token);
      alert("Profil supprimé avec succès.");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  const togglePopup = () => {
    setDisplayDeletePopup(!displayDeletePopup);
  };

  // To update the list of the posts after creating a new post
  function handleNewPostChange() {
    const url = "http://localhost:3000/api/posts";
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.token}`,
      },
    };
    fetch(url, options).then(
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            setPostsList(data);
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  return (
    <main className="dashboard">
      {profileEditing ? (
        <div className="profileContainer">
          <EditProfile
            key={currentUser.user.userId}
            usernameInput={usernameInput}
            emailInput={emailInput}
            currentPasswordInput={currentPasswordInput}
            newPasswordInput={newPasswordInput}
            newPasswordConfirmInput={newPasswordConfirmInput}
            onUsernameChange={handleUsernameChange}
            onEmailChange={handleEmailChange}
            onCurrentPasswordChange={handleCurrentPasswordChange}
            onNewPasswordChange={handleNewPasswordChange}
            onNewPasswordConfirmChange={handleNewPasswordConfirmChange}
            error={error}
          />
          <button className="profileButton" onClick={handleUpdateClick}>
            Enregistrer
          </button>
          <button className="cancelButton" onClick={handleClick}>
            Annuler
          </button>
        </div>
      ) : (
        <aside className="profileContainer">
          <Profile />
          <button className="editButton" onClick={handleClick}>
            Modifier
          </button>
          <button className="deleteButton" onClick={togglePopup}>
            Supprimer
          </button>
          <p className="historyButton">
            <Link to="/activity">Consulter l'historique</Link>
          </p>
        </aside>
      )}
      <div className="postArea">
        <h1 className="dashboardTitle">Bienvenue {currentUser.user.username}</h1>
        <Newpost onNewPostChange={handleNewPostChange} />
        <div className="postFeed">
          {postsList.map((elt) => {
            const postKey = "postKey-" + elt.id;
            return (
              <Posts key={postKey} user={elt.user.username} postContent={elt.postContent} imageUrl={elt.imageUrl} dateTime={elt.dateTime} />
            );
          })}
        </div>
      </div>
      {
        // Popup to confirm the deletion of the current user
      }
      {displayDeletePopup && (
        <DisplayPopup
          content={
            <div className="newpostForm">
              <p>Cette action supprime définitivement ton profil. Es-tu sûr.e de toi ?</p>
              <button className="confirmDeleteButton" onClick={handleDelete}>
                Je confirme que je souhaite supprimer mon profil
              </button>
            </div>
          }
          handleClose={togglePopup}
        />
      )}
    </main>
  );
};

export default Dashboard;
