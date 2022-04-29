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
  const { currentUser, deleteProfile } = useAuth();
  const [postsList, setPostsList] = useState([]);
  const [profileEditing, setProfileEditing] = useState(false);
  const [displayDeletePopup, setDisplayDeletePopup] = useState(false);

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

  function handleClick() {
    if (profileEditing === true) {
      //Update profile
    }
    setProfileEditing(!profileEditing);
  }

  const navigate = useNavigate();

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
          <EditProfile key={currentUser.user.userId} username={currentUser.user.username} email={currentUser.user.email} />
          <button className="profileButton" onClick={handleClick}>
            Enregistrer
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
            <Link to="/profileActivity">Consulter l'historique</Link>
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
