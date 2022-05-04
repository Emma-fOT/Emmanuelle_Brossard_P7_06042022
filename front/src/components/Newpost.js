import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Newpost.css";
import DisplayPopup from "./DisplayPopup";

export default function Newpost(props) {
  const newpostContentRef = useRef(null);
  const newImageUrlRef = useRef(null);
  const [newImageUrl, setNewImageUrl] = useState();
  const [error, setError] = useState();
  const { currentUser } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const togglePopup = () => {
    setIsOpen(!isOpen);
    setError("");
    setNewImageUrl(null);
  };

  function handleUploadImage(e) {
    const img = e.target.files[0];
    setNewImageUrl(img);
  }

  async function newpostSubmit(event) {
    event.preventDefault();
    const newpostContent = newpostContentRef.current.value;
    if (newpostContent === "") {
      setError("Ecris quelque chose avant de poster !");
    } else {
      const img = newImageUrlRef.current.files[0];
      if (img !== undefined && !img.type.match("image/jpg|jpeg|png")) {
        setError("Format d'image invalide. L'image doit être au format jpg, jpeg ou png");
      } else {
        try {
          await saveNewpost(newpostContent, newImageUrl);
          props.onNewPostChange(); //Lifting the state up
          alert("Post créé avec succès. Merci pour ta contribution !");
          togglePopup();
        } catch (error) {
          alert("Une erreur est survenue lors de la création du post.");
        }
      }
    }
  }

  function saveNewpost(postContent, imageUrl) {
    //Impossible to send a file through a JSON request using fetch
    //Delete the header "Content-Type"
    //And use formData instead of json
    const formData = new FormData();
    formData.append("postContent", postContent);
    formData.append("imageUrl", imageUrl);
    return fetch("http://localhost:3000/api/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${currentUser.token}`,
      },
      body: formData,
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
        <DisplayPopup
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
              <label className="imageLabel">Ajouter une photo au post : </label>
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                id="newImageUrlInput"
                name="newImageUrlInput"
                ref={newImageUrlRef}
                onChange={handleUploadImage}
              ></input>
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
