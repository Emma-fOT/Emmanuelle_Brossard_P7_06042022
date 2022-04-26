import React from "react";
import "../styles/Post.css";

export default function Post(props) {
  return (
    <div className="post">
      <p className="postAuthor">{props.userId}</p>
      <p className="postContent">{props.postContent}</p>
      <p className="dateTime">{props.dateTime}</p>
    </div>
  );
}
