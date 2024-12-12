import React, { useContext, useState } from "react";
import { AppThemeContext, DataContext } from "../../App";
import { ArrowDropDown, ArrowDropUp, Check, Close } from "@mui/icons-material";
import "./addTask.css";
import uuid from "react-uuid";
function AddTaskModal({
  taskName,
  host,
  taskDescription,
  taskId,
  columnTitle,
  columnId,
}) {
  const { boards, dispatchBoards } = useContext(DataContext);
  const { isDark} = useContext(AppThemeContext);
  const [editing, setEditing] = useState({
    userTaskTitle: taskName,
    userTaskDescription: taskDescription,
  });
  const [isValid, setValid] = useState({
    userTaskTitle: true,
    userTaskDescription: true,
  });
  const [isOpen, setOpen] = useState(false);
  const [editColumn, setEditColumn] = useState(columnTitle);

  const currentBoardObj = boards?.boardsList?.find(
    (item) => item?.id === boards?.selectedBoard
  );
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValid((prevValid) => ({
      ...prevValid,
      [name]: true,
    }));
    host === "add"
      ? dispatchBoards({
          type: "UPDATE_TASKS_INPUT",
          payload: {
            name,
            value,
          },
        })
      : setEditing((prevVal) => ({
          ...prevVal,
          [name]: value,
        }));
  };
  const { userTaskTitle, userTaskDescription } = boards;

  const handleCreate = () => {
    if (!userTaskDescription.trim()) {
      setValid((prev) => ({ ...prev, userTaskDescription: false }));
      return;
    }
    if (!userTaskTitle.trim()) {
      setValid((prev) => ({ ...prev, userTaskTitle: false }));
      return;
    }

    if (!currentBoardObj) {
      console.warn("No matching board found.");
      return;
    }

    const updatedBoard = {
      ...currentBoardObj,
      columns: currentBoardObj?.columns?.map((item) =>
        item?.columnTitle === boards?.status
          ? {
              ...item,
              tasks: [
                ...item.tasks,
                {
                  taskId: uuid(),
                  taskName: boards?.userTaskTitle,
                  taskDescription: boards?.userTaskDescription,
                },
              ],
            }
          : item
      ),
    };

    dispatchBoards({
      type: "ADD_NEW_TASK",
      payload: { updatedBoard },
    });
  };

  const handleEdit = () => {
    if (!editing.userTaskDescription.trim()) {
      setValid((prev) => ({ ...prev, userTaskDescription: false }));
      return;
    }
    if (!editing.userTaskTitle.trim()) {
      setValid((prev) => ({ ...prev, userTaskTitle: false }));
      return;
    }

    if (!currentBoardObj) {
      console.warn("No matching board found.");
      return;
    }

    let taskToMove = null; // To hold the task if it needs to be moved

const updatedBoardObj = {
  ...currentBoardObj,
  columns: currentBoardObj.columns.map((column) => {
    // Handle the current column
    if (column.columnTitle === columnTitle) {
      // Remove the task if the status (editColumn) is different
      const filteredTasks = column.tasks.filter((task) => {
        if (task.taskId === taskId && editColumn !== columnTitle) {
          // Task is being moved; modify it and store it in taskToMove
          taskToMove = {
            ...task,
            taskName: editing.userTaskTitle,
            taskDescription: editing.userTaskDescription,
          };
          return false; // Exclude this task
        }
        return true; // Keep other tasks
      });

      return {
        ...column,
        tasks: filteredTasks, // Update the column with the task removed
      };
    }

    // Handle the target column
    if (column.columnTitle === editColumn) {
      return {
        ...column,
        tasks: taskToMove
          ? [...column.tasks, taskToMove] // Add the modified task
          : column.tasks, // If no task to move, do nothing
      };
    }

    // Leave all other columns unchanged
    return column;
  }),
};
    dispatchBoards({ type: "EDIT_TASK", payload: { updatedBoardObj } });
  };
  return (
    <div className="modal-wrapper">
      <article className={`modal-container ${!isDark && "light-modal"}`}>
        <header className="modal-header">
          <h2 className="text-2xl title">
            {host === "add" ? "New Task" : "Edit Task"}
          </h2>
          <button
            type="button"
            className="close-modal-btn"
            onClick={() =>
              dispatchBoards({
                type: "CLOSE_MODAL",
                key: host === "add" ? "taskModal" : "editTaskModal",
              })
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
            value={
              host === "add" ? boards?.userTaskTitle : editing.userTaskTitle
            }
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
            value={
              host === "add"
                ? boards?.userTaskDescription
                : editing.userTaskDescription
            }
            className={`task-description ${
              !isValid.userTaskDescription && "border-error"
            }`}
            onChange={handleChange}
            placeholder="Use this place to describe what your task is about..."
            rows={6}
          />
          {!isValid.userTaskDescription && (
            <span className="text-xs text-crimson">
              Can't be empty nor too short!
            </span>
          )}
        </fieldset>
        {/*
         *
         *
         * Choosing Status
         *
         *
         */}
        <div className="status-wrapper">
          <p className="status-header">
            Status
          </p>
          <button
            type="button"
            onClick={() => setOpen(!isOpen)}
            className="status-btn"
          >
            {host === "add" ? boards?.status : editColumn}
            {isOpen ? (
              <ArrowDropUp className="status-icon" />
            ) : (
              <ArrowDropDown className="status-icon" />
            )}
          </button>
          {isOpen && (
            <ul className="status-list">
              {currentBoardObj?.columns?.map((item) => {
                const isSelected =
                  host === "add"
                    ? boards?.status === item?.columnTitle
                    : editColumn === item?.columnTitle;
                return (
                  <li key={item?.columnId} className="status-item">
                    <button
                      type="button"
                      className={`status-option ${isSelected && "current"} `}
                      onClick={() => {
                        host === "add"
                          ? dispatchBoards({
                              type: "UPDATE_TASKS_STATUS",
                              status: item?.columnTitle,
                            })
                          : setEditColumn(item?.columnTitle);
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

        {/*
         *
         * ACTIONS CONTENT
         *
         *
         *
         *
         *
         */}
        <div className="actions-wrapper">
          <button
            type="button"
            className="btn create"
            onClick={host === "add" ? handleCreate : handleEdit}
          >
            Create task <Check />
          </button>
          <button
            type="button"
            className="btn cancel"
            onClick={() =>
              dispatchBoards({
                type: "CLOSE_MODAL",
                key: host === "add" ? "taskModal" : "editTaskModal",
              })
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
