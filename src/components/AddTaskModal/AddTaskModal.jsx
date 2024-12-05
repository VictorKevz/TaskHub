import React, { useContext, useState } from "react";
import { DataContext } from "../../App";
import { ArrowDropDown, ArrowDropUp, Check, Close } from "@mui/icons-material";
import "./addTask.css";
import uuid from "react-uuid";
function AddTaskModal() {
  const { boards, dispatchBoards, currentBoard } = useContext(DataContext);

  const [isValid, setValid] = useState({
    userTaskTitle: true,
    taskDescription: true,
  });
  const statusList = ["To Do", "In Progress", "Completed"];
  const [isOpen, setOpen] = useState(false);

  const currentBoardObj = boards?.boardsList?.find(
    (item) => item?.id === currentBoard
  );
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
  const { userTaskTitle, userTaskDescription } = boards;

  const handleCreate = () => {
    if (!userTaskDescription.trim()) {
      setValid((prevValid) => ({
        ...prevValid,
        userTaskDescription: false,
      }));
      return;
    }
    if (!userTaskTitle.trim()) {
      setValid((prevValid) => ({
        ...prevValid,
        userTaskTitle: false,
      }));
      return;
    } else {
      dispatchBoards({
        type: "ADD_NEW_TASK",
        payload: {
          currentBoard,
          status:boards?.status,
          tasks: {
            taskId: uuid(),
            taskName: boards?.userTaskTitle,
            taskDescription: boards?.userTaskDescription,
          },
        },
      });
    }
  };
  return (
    <div className="modal-wrapper">
      <article className="modal-container">
        <header className="modal-header">
          <h2 className="text-2xl title">New Task</h2>
          <button
            type="button"
            className="close-modal-btn"
            onClick={() =>
              dispatchBoards({ type: "CLOSE_MODAL", key: "taskModal" })
            }
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
            placeholder="eg Task 1."
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
            value={boards?.userTaskDescription}
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
          <p className="status-header">
            Status
            {/* {!isLogoValid && (
              <span className="text-xs text-crimson">
                Select at least one logo!
              </span>
            )} */}
          </p>
          <button
            type="button"
            onClick={() => setOpen(!isOpen)}
            className="status-btn"
          >
            {boards?.status}{" "}
            {isOpen ? (
              <ArrowDropUp className="status-icon" />
            ) : (
              <ArrowDropDown className="status-icon" />
            )}
          </button>
          {isOpen && (
            <ul className="status-list">
              {currentBoardObj?.columns?.map((item) => {
                const isSelected = boards?.status === item?.columnTitle;
                return (
                  <li key={item?.columnId} className="status-item">
                    <button
                      type="button"
                      className={`status-option ${isSelected && "current"} `}
                      onClick={() => {
                        dispatchBoards({
                          type: "UPDATE_TASKS_STATUS",
                          status: item?.columnTitle,
                        });
                        setOpen(false);
                      }}
                    >
                      {item?.columnTitle}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="actions-wrapper">
          <button type="button" className="btn create" onClick={handleCreate}>
            Create task <Check />
          </button>
          <button
            type="button"
            className="btn cancel"
            onClick={() =>
              dispatchBoards({ type: "CLOSE_MODAL", key: "taskModal" })
            }
          >
            Cancel
          </button>
        </div>
      </article>
    </div>
  );
}

export default AddTaskModal;
