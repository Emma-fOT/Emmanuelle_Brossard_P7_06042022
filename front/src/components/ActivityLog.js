import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Posts from "./Posts";
import "../styles/ActivityLog.css";

export default function ActivityLog() {
  const [postsList, setPostsList] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const url = "http://localhost:3000/api/posts/" + currentUser.user.userId;
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
  }, [currentUser]);

  return (
    <div className="activityContainer">
      <h1 className="activityTitle">Historique de test posts</h1>
      <p className="activityBackToDashboard">
        <Link to="/dashboard">Retour au tableau de bord</Link>
      </p>
      <div className="activityFeed">
        {postsList.map((elt) => {
          return <Posts key={elt.id} user={elt.user.username} postContent={elt.postContent} dateTime={elt.dateTime} />;
        })}
      </div>
    </div>
  );
}
