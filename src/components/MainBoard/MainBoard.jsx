import React, { useContext } from "react";
import "./mainBoard.css";
import { DataContext } from "../../App";
import { AddCircle, Tune } from "@mui/icons-material";
import AddTaskModal from "../AddTaskModal/AddTaskModal";
import { coverImages } from "./coverImages";
import TaskCard from "../TaskCard/TaskCard";

function MainBoard() {
  const { boards, currentBoard, dispatchBoards } = useContext(DataContext);
  const currentObj = boards?.boardsList.find((obj) => obj.id === currentBoard);
  
  return (
    <section className="board-wrapper">
      <header className="board-header">
        <h2 className="board-name">{currentObj?.title}</h2>
        <div className="options-wrapper">
          <button
            type="button"
            className="open-taskModal-btn"
            onClick={() =>
              dispatchBoards({ type: "OPEN_MODAL", key: "taskModal" })
            }
          >
            <AddCircle />
            Create Task
          </button>
          <button type="button" className="edit-board-btn">
            <Tune />
          </button>
        </div>
      </header>
      <div className="board-container">
        {currentObj?.columns?.map((item, i) => (
          <section key={item?.columnId} className="col-wrapper">
            <header className="col-header">
              <p className="column-item">
                <span
                  className={`dot ${i === 1 && "second"} ${i === 2 && "third"}`}
                ></span>{" "}
                {item?.columnTitle}(
                {item?.tasks?.length > 0 ? item?.tasks?.length : 0})
              </p>
            </header>
            <article className="task-card-wrapper">
              {item?.tasks?.length > 0 ? (
                item.tasks.map((task) => (
                 <TaskCard key={task?.taskId} task={task}/>
                ))
              ) : (
                <p className="empty-parag">No tasks available</p>
              )}
            </article>
          </section>
        ))}
      </div>
      {boards?.taskModal && <AddTaskModal />}
    </section>
  );
}

export default MainBoard;