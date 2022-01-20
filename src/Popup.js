import React from "react";

const Popup = (props) => {

  return (
    <div className="small-popup-box">
      <div className="small-box">
      <span className="close-icon" onClick={props.handleClose}>x</span>
        {props.content}
      </div>
    </div>
  );
};

export default Popup;