import { Warning } from "@mui/icons-material";
import React, { useContext } from "react";
import "./warningModal.css";
import { AppThemeContext, DataContext } from "../../App";
function WarningModal({ title, message, id, host,columnId }) {
  const { dispatchBoards, boards } = useContext(DataContext);
  const{isDark} = useContext(AppThemeContext)
  return (
    <div className="modal-wrapper">
      <div className={`modal-container warning ${!isDark && "light-modal"}`}>
        <span className="warning-icon">
          <Warning className="amber-icon" />
        </span>

        <h3 className="modal-title">{title}</h3>

        <p className="modal-warning-parag"> {message}</p>
        <div className="warning-modal-btns-wrapper">
          <button
            type="button"
            className="warning-modal-btn keep"
            onClick={() =>
              dispatchBoards({
                type: "CLOSE_MODAL",
                key: host === "task" ? "taskWarningModal" : "boardWarningModal",
              })
            }
          >
            No,Keep It
          </button>
          <button
            type="button"
            className="warning-modal-btn delete"
            onClick={() =>
              host === "task"
                ? dispatchBoards({
                    type: "DELETE_TASK",
                    payload: { taskId: id, boardId: boards?.selectedBoard,columnId },
                  })
                : dispatchBoards({ type: "DELETE_BOARD", id })
            }
          >
            Yes, Delete it
          </button>
        </div>
      </div>
    </div>
  );
}

export default WarningModal;
