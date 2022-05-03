import React from "react";
import "../styles/Posts.css";
import ReactTimeAgo from "react-time-ago";

export default function Posts(props) {
  return (
    <div className="post">
      <p className="postAuthor">{props.user}</p>
      <p className="postContent">{props.postContent}</p>
      {props.imageUrl && <img className="postImage" alt={"Image liée au post de " + props.user} src={props.imageUrl}></img>}
      <p className="dateTime">
        <ReactTimeAgo date={Date.parse(props.dateTime)} />
      </p>
    </div>
  );
}
