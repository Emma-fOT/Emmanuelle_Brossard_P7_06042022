import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Profile from "./Profile";
import EditProfile from "./EditProfile";
import Newpost from "./Newpost";
import Posts from "./Posts";
import DisplayDeletePopup from "./DisplayDeletePopup";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { currentUser, deleteProfile, updateProfile } = useAuth();
  const [postsList, setPostsList] = useState([]);
  const [profileEditing, setProfileEditing] = useState(false);
  const [displayDeletePopup, setDisplayDeletePopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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
  function handleUsernameChange(usernameInput) {
    setUsernameInput(usernameInput);
  }
  function handleEmailChange(emailInput) {
    setEmailInput(emailInput);
  }

  function handleUpdateClick() {
    if (profileEditing === true) {
      updateProfile(usernameInput, emailInput);
    }
    setProfileEditing(!profileEditing);
  }

  function handleClick() {
    setProfileEditing(!profileEditing);
  }

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

  return (
    <div className="dashboard">
      {profileEditing ? (
        <div className="profileContainer">
          <EditProfile
            key={currentUser.user.userId}
            usernameInput={usernameInput}
            emailInput={emailInput}
            onUsernameChange={handleUsernameChange}
            onEmailChange={handleEmailChange}
          />
          <button className="profileButton" onClick={handleUpdateClick}>
            Enregistrer
          </button>
          <button className="cancelButton" onClick={handleClick}>
            Annuler
          </button>
        </div>
      ) : (
        <div className="profileContainer">
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
        </div>
      )}
      <div className="postArea">
        <h1 className="dashboardTitle">Bienvenue {currentUser.user.username}</h1>
        <Newpost />
        <div className="postFeed">
          {postsList.map((elt) => {
            return <Posts key={elt.id} user={elt.user.username} postContent={elt.postContent} dateTime={elt.dateTime} />;
          })}
        </div>
      </div>
      {displayDeletePopup && (
        <DisplayDeletePopup
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
    </div>
  );
};

export default Dashboard;
