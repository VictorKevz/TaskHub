import React from "react";
import { coverImages } from "../MainBoard/coverImages";
import "./taskCard.css";
import { Delete, MoreVert } from "@mui/icons-material";
function TaskCard({ task }) {
  const index = Math.floor(Math.random() * coverImages.length);
  return (
    <div className="task-card">
      <div
        className="task-card-bg"
        style={{
          background: `url(${coverImages[index]}) no-repeat center/cover`,
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
        <div className="options-wrapper">
        <button type="button" className="edit-task-btn"><MoreVert/></button>
        <button type="button" className="delete-task-btn"><Delete/></button>
        
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
