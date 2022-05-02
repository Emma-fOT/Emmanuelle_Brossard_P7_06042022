import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Newpost.css";
import NewpostPopup from "./NewpostPopup";

export default function Newpost(props) {
  const newpostContentRef = useRef(null);
  const [error, setError] = useState();
  const { currentUser } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  async function newpostSubmit(event) {
    event.preventDefault();
    const newpostContent = newpostContentRef.current.value;
    if (newpostContent === "") {
      setError("Ecris quelque chose avant de poster !");
    } else {
      try {
        await saveNewpost(newpostContent);
        props.onNewPostChange(); //Lifting the state up
        alert("Post créé avec succès. Merci pour ta contribution !");
        togglePopup();
      } catch (error) {
        alert("Une erreur est survenue lors de la création du post.");
      }
    }
  }

  function saveNewpost(postContent) {
    return fetch("http://localhost:3000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.token}`,
      },
      body: JSON.stringify({
        postContent,
      }),
    })
      .then((res) => res.json())
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="newpost">
      <input className="newpostArea" type="button" value="Quoi de neuf ?" onClick={togglePopup} />
      {isOpen && (
        <NewpostPopup
          content={
            <div className="newpostForm">
              {error && <p className="error">{error}</p>}
              <textarea
                id="newpostContent"
                name="newpostContent"
                placeholder="De quoi souhaites-tu discuter ?"
                ref={newpostContentRef}
                required
              />
              <button className="submitButton" onClick={newpostSubmit}>
                Publier
              </button>
            </div>
          }
          handleClose={togglePopup}
        />
      )}
    </div>
  );
}
