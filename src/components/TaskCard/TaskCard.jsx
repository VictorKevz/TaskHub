import React, { useContext, useState } from "react";
import { coverImages } from "../MainBoard/coverImages";
import "./taskCard.css";
import { Delete, EditNote } from "@mui/icons-material";
import { DataContext } from "../../App";

function TaskCard({ task, columnId,columnTitle }) {
  const { boards, dispatchBoards } = useContext(DataContext);
  const index = Math.floor(Math.random() * 8);
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
        <div className="options-btn-wrapper">
          <button type="button" 
          className="edit-task-btn"
          onClick={() => dispatchBoards({type:"OPEN_MODAL",
            payload:{
            key:"editTaskModal",
            modalData:{
                taskName:task.taskName,
                taskId:task.taskId,
                columnId: columnId,
                taskDescription:task.taskDescription,
                columnTitle:columnTitle
            }
        }})}
          >
            <EditNote />
          </button>
          <button
            type="button"
            className="delete-task-btn"
            onClick={() =>
              dispatchBoards({ type: "OPEN_MODAL", payload:{
                key: "taskWarningModal",
                modalData:{
                    taskId:task.taskId,
                    columnId:columnId,
                    taskName:task.taskName
                }
            } })
            }
          >
            <Delete />
          </button>
        </div>
      </div>

    </div>
  );
}

export default TaskCard;
