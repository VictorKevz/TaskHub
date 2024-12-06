import { Warning } from "@mui/icons-material";
import React, { useContext } from "react";
import "./warningModal.css";
import { DataContext } from "../../App";
function WarningModal({ title, message, id, onClose }) {
  const { dispatchBoards } = useContext(DataContext);
  return (
    <div className="modal-wrapper">
      <div className="modal-container warning">
        <span className="warning-icon">
          <Warning className="amber-icon" />
        </span>
        
        <h3 className="modal-title">{title}
        
        </h3>

        <p className="modal-warning-parag"> {message}</p>
        <div className="warning-modal-btns-wrapper">
          <button
            type="button"
            className="warning-modal-btn keep"
            onClick={() => onClose(false)}
          >
            No,Keep It
          </button>
          <button type="button" className="warning-modal-btn delete" onClick={() => dispatchBoards({type:"DELETE_BOARD",id})}>
            Yes, Delete it
          </button>
        </div>
      </div>
    </div>
  );
}

export default WarningModal;
