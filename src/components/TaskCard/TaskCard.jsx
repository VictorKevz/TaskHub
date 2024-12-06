import React, { useContext, useState } from "react";
import { coverImages } from "../MainBoard/coverImages";
import "./taskCard.css";
import { Delete, MoreVert } from "@mui/icons-material";
import { DataContext } from "../../App";
import WarningModal from "../WarningModal/WarningModal";
function TaskCard({ task, count }) {
  const { boards, dispatchBoards } = useContext(DataContext);
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="task-card">
      <div
        className="task-card-bg"
        style={{
          background: `url(${coverImages[count]}) no-repeat center/cover`,
        }}
      >
        <div className="overlay task-cover"></div>
      </div>
      <div className="info-actions-wrapper">
        <div className="card-info">
          <h3 className="task-title">{task.taskName}</h3>
          <p className="task-parag">{task.taskDescription}</p>
          <ul className="tags-wrapper">
            {task?.tags?.map((tag, i) => (
              <li key={i} className="tag-item">
                {tag}
              </li>
            ))}
          </ul>
        </div>
        <div className="options-btn-wrapper">
          <button type="button" className="edit-task-btn">
            <MoreVert />
          </button>
          <button
            type="button"
            className="delete-task-btn"
            onClick={() => setOpenModal(true)}
          >
            <Delete />
          </button>
        </div>
      </div>
      {openModal && (
        <WarningModal
          id={task.taskId}
          title={`Want to delete task: '${task.taskName}' ? `}
          message={
            "This action can't be undone. This task and its description will be permanently deleted!"
          }
          onClose={setOpenModal}
        />
      )}
    </div>
  );
}

export default TaskCard;
