import React from "react";
import { useAuth } from "../contexts/AuthContext";
import Profile from "./Profile";
import Newpost from "./Newpost";
import Post from "./Post";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div className="dashboard">
      <div className="profileContainer">
        <Profile />
      </div>
      <div className="postArea">
        <h1 className="dashboardTitle">Welcome {currentUser.username}</h1>
        <Newpost />
        <Post />
      </div>
    </div>
  );
};

export default Dashboard;
