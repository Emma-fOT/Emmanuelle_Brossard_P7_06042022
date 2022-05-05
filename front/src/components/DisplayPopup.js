import React from "react";
import "../styles/DisplayPopup.css";

const DisplayPopup = (props) => {
  return (
    <section className="popup-box">
      <div className="box">
        <span className="close-icon" onClick={props.handleClose}>
          x
        </span>
        {props.content}
      </div>
    </section>
  );
};

export default DisplayPopup;
