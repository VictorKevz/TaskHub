import React, { useContext, useState } from "react";
import { DataContext } from "../../App";
import { ArrowDropDown, ArrowDropUp, Close } from "@mui/icons-material";
import "./addTask.css"
function AddTaskModal() {
  const { boards, dispatchBoards } = useContext(DataContext);

  const [isValid, setValid] = useState({
    userTaskTitle: true,
    taskDescription: true,
  });
  const status = ["To Do", "In Progress", "Completed"];
  const [isOpen, setOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValid((prevValid) => ({
      ...prevValid,
      [name]: true,
    }));
    dispatchBoards({
      type: "UPDATE_TASKS_INPUT",
      payload: {
        name,
        value,
      },
    });
  };
  return (
    <div className="modal-wrapper">
      <article className="modal-container">
      <header className="modal-header">
          <h2 className="text-2xl title">New Task</h2>
          <button
            type="button"
            className="close-modal-btn"
            onClick={() => dispatchBoards({ type: "CLOSE_MODAL",key:"taskModal" })}
          >
            <Close className="text-2xl" />
          </button>
        </header>
        <fieldset className="field">
          <label htmlFor="taskName" className="board-label">
            Task Title
          </label>
          <input
            type="text"
            id="taskName"
            name="userTaskTitle"
            value={boards?.userTaskTitle}
            className={`board-input task ${
              !isValid.userTaskTitle && "border-error"
            }`}
            onChange={handleChange}
            placeholder="eg Default Board."
          />
          {!isValid.userTaskTitle && (
            <span className="text-xs text-crimson">
              Can't be empty nor too short!
            </span>
          )}
        </fieldset>

        <fieldset className="field">
          <label htmlFor="taskDescription" className="board-label">
            Task Description
          </label>
          <textarea
            type="text"
            id="taskDescription"
            name="userTaskDescription"
            value={boards?.userTaskTitle}
            className={`task-description `}
            onChange={handleChange}
            placeholder="Use this place to describe what your task is about..."
            rows={6}
          />
          {!isValid.taskDescription && (
            <span className="text-xs text-crimson">
              Can't be empty nor too short!
            </span>
          )}
        </fieldset>
        {/*
         *
         *
         * Choosing Logos
         *
         *
         */}
        <div className="status-wrapper">
          <p className="logo-header">
            Status
            {/* {!isLogoValid && (
              <span className="text-xs text-crimson">
                Select at least one logo!
              </span>
            )} */}
          </p>
          <button type="button" onClick={() => setOpen(!isOpen)} className="status-btn">
            {boards?.status} {isOpen ? <ArrowDropUp /> : <ArrowDropDown />}
          </button>
         {isOpen && (
             <ul className="status-list">
             {status.map((status, i) => {
               const isSelected = boards?.status === status;
               return (
                 <li key={i} className="status-item">
                   <button
                     type="button"
                     className={`status-option `}
                     onClick={() => {

                     }}
                   >
                     {status}
                   </button>
                 </li>
               );
             })}
           </ul>
         )}
        </div>
      </article>
    </div>
  );
}

export default AddTaskModal;
