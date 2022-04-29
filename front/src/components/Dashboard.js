import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Profile from "./Profile";
import Newpost from "./Newpost";
import Posts from "./Posts";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [postsList, setPostsList] = useState([]);

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

  return (
    <div className="dashboard">
      <div className="profileContainer">
        <Profile />
      </div>
      <div className="postArea">
        <h1 className="dashboardTitle">Bienvenue {currentUser.user.username}</h1>
        <Newpost />
        <div className="postFeed">
          {postsList.map((elt) => {
            return <Posts key={elt.id} user={elt.user.username} postContent={elt.postContent} dateTime={elt.dateTime} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
