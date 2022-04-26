import React from "react";
import "../styles/Post.css";
import ReactTimeAgo from "react-time-ago";

export default function Posts(props) {
  return (
    <div className="post">
      <p className="postAuthor">{props.user}</p>
      <p className="postContent">{props.postContent}</p>
      <p className="dateTime">
        <ReactTimeAgo date={Date.parse(props.dateTime)} />
      </p>
    </div>
  );
}
