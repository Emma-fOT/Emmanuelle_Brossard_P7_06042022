import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Posts from "./Posts";
import DisplayPopup from "./DisplayPopup";
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [postsList, setPostsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [displayDeletePostPopup, setDisplayDeletePostPopup] = useState(false);
  const [displayDeleteUserPopup, setDisplayDeleteUserPopup] = useState(false);
  const [postToDeleteId, setPostToDeleteId] = useState(null);
  const [userToDeleteId, setUserToDeleteId] = useState(null);
  const [isPostMngtOpened, setIsPostMngtOpened] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.token}`,
      },
    }).then(
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
    fetch("http://localhost:3000/api/auth/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.token}`,
      },
    }).then(
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            setUsersList(data);
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }, [currentUser]);

  async function handleConfirmPostDelete() {
    try {
      fetch("http://localhost:3000/api/posts/" + postToDeleteId, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      }).then(() => {
        alert("Post supprimé avec succès.");
        togglePostPopup();
        //Update the state to force to rerender the component, in order to refresh the page (to update the posts list)
        //Other possibility (but not super clean when using React): refresh the full page: window.location.reload();
        const newPostsList = postsList.filter((post) => post.id !== parseInt(postToDeleteId));
        setPostsList(newPostsList);
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function handleConfirmUserDelete() {
    try {
      //Find all the postIds of the user to delete
      fetch("http://localhost:3000/api/auth/" + userToDeleteId + "/posts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
      }).then(
        (response) => {
          if (response.ok) {
            response.json().then((data) => {
              //Delete all the posts of the user to delete
              data.forEach((post) => {
                fetch("http://localhost:3000/api/posts/" + post.id, {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                  },
                }).catch((error) => {
                  console.log("Error: " + error);
                  alert("Une erreur est apparue pendant l'opération de suppression des posts associés à ce profil.");
                });
              });
              deleteProfile();
            });
          } else {
            console.log("Error: " + response.status);
            alert(
              "Une erreur est apparue lors de l'opération de recherche des posts associés à ce profil. Le profil et ses posts associés n'ont pas été supprimés."
            );
          }
        },
        (error) => {
          console.log("Error: " + error);
          alert(
            "Une erreur est apparue lors de l'opération de recherche des posts associés à ce profil. Le profil et ses posts associés n'ont pas été supprimés."
          );
        }
      );
    } catch (error) {
      console.log("Error: " + error);
      alert("Problème de connexion à l'API. Le profil et ses posts associés n'ont pas été supprimés.");
    }
  }

  //Delete the user
  async function deleteProfile() {
    try {
      fetch("http://localhost:3000/api/auth/" + userToDeleteId, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      }).then(() => {
        alert("Profil supprimé avec succès.");
        toggleUserPopup();
        const newUsersList = usersList.filter((user) => user.id !== parseInt(userToDeleteId));
        setUsersList(newUsersList);
        const newPostsList = postsList.filter((post) => post.userId !== parseInt(userToDeleteId));
        setPostsList(newPostsList);
      });
    } catch (err) {
      console.log(err);
      alert("Une erreur est apparue pendant l'opération de suppression du profil. Les posts associés à ce profil ont bien été supprimés.");
    }
  }

  const togglePostPopup = () => {
    setDisplayDeletePostPopup(!displayDeletePostPopup);
  };

  const toggleUserPopup = () => {
    setDisplayDeleteUserPopup(!displayDeleteUserPopup);
  };

  const handlePostDelete = (event) => {
    setPostToDeleteId(event.currentTarget.dataset.id);
    togglePostPopup();
  };

  const handleUserDelete = (event) => {
    setUserToDeleteId(event.currentTarget.dataset.id);
    toggleUserPopup();
  };

  const handlePostMngt = () => {
    setIsPostMngtOpened(true);
  };

  const handleUserMngt = () => {
    setIsPostMngtOpened(false);
  };

  return (
    <main className="adminDashboard">
      <aside className="adminMenuContainer">
        <h1 className="adminDashboardTitle">Bienvenue dans le tableau d'administration</h1>
        <button className="mngtButton" onClick={handlePostMngt}>
          Modérer les posts
        </button>
        <button className="mngtButton" onClick={handleUserMngt}>
          Gérer les utilisateurs
        </button>
      </aside>
      {isPostMngtOpened ? (
        <div className="postMngtArea">
          <h2>Gestion des posts</h2>
          <div className="postMngtFeed">
            {postsList.map((elt) => {
              const postKey = "adminPostKey-" + elt.id;
              return (
                <div key={postKey} className="displayPost">
                  <div className="deleteAdminButtonContainer">
                    <button data-id={elt.id} className="deleteAdminButton" onClick={handlePostDelete}>
                      X
                    </button>
                  </div>
                  <Posts user={elt.user.username} postContent={elt.postContent} imageUrl={elt.imageUrl} dateTime={elt.dateTime} />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="userMngtArea">
          <h2>Gestion des utilisateurs</h2>
          <div className="userMngtFeed">
            {
              //Other possibility: to use React Table: https://react-table.tanstack.com/
            }
            <table>
              <thead>
                <tr>
                  <th className="actionRaw">Action</th>
                  <th className="emailRaw">Email</th>
                  <th className="pseudoRaw">Pseudo</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((elt) => {
                  const userKey = "adminUserKey-" + elt.id;
                  return (
                    <tr key={userKey}>
                      <td>
                        <div className="deleteAdminButtonContainer">
                          <button data-id={elt.id} className="deleteAdminButton" onClick={handleUserDelete}>
                            X
                          </button>
                        </div>
                      </td>
                      <td>
                        <span className="adminEmail">{elt.email}</span>
                      </td>
                      <td>
                        <span className="adminUsername">{elt.username}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {displayDeletePostPopup && (
        <DisplayPopup
          content={
            <div className="newpostForm">
              <p>Cette action supprime définitivement ce post. Es-tu sûr.e de toi ?</p>
              <button className="confirmDeleteButton" onClick={handleConfirmPostDelete}>
                Je confirme que je souhaite supprimer ce post
              </button>
            </div>
          }
          handleClose={togglePostPopup}
        />
      )}
      {displayDeleteUserPopup && (
        <DisplayPopup
          content={
            <div className="newpostForm">
              <p>Cette action supprime définitivement ce profil et tous ses posts. Es-tu sûr.e de toi ?</p>
              <button className="confirmDeleteButton" onClick={handleConfirmUserDelete}>
                Je confirme que je souhaite supprimer ce profil
              </button>
            </div>
          }
          handleClose={toggleUserPopup}
        />
      )}
    </main>
  );
}
