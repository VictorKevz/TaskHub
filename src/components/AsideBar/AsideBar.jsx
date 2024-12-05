import React, { useContext, useState } from "react";
import {
  AddCircle,
  Assignment,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import "./asideBar.css";
import ThemeSwitch from "../Theme/ThemeSwitch";
import { DataContext } from "../../App";
import AddBoardModal from "../AddBoardModal/AddBoardModal";
import openIcon from "../../assets/images/sidebar-open.svg";
import closeIcon from "../../assets/images/sidebar-close.svg";

function AsideBar() {
  const { boards, dispatchBoards, currentBoard, setCurrentBoard } =
    useContext(DataContext);
  const [isOpen, setOpen] = useState(true);
  return (
    <aside className={`aside-wrapper ${!isOpen && "minimized"}`}>
      <div className="logo-menu-wrapper">
        <h1 className="logo">
          <span>
            <Assignment className="logo-icon" />
          </span>
          {isOpen && "TaskHub"}
        </h1>
        <button
          type="button"
          className="toggle-menu-btn"
          onClick={() => setOpen(!isOpen)}
        >
          <img src={isOpen ? closeIcon : openIcon} alt="" className="toggle-icon" aria-hidden="true" />
        </button>
      </div>

      <ul className="board-names">
        {boards?.boardsList?.map((board) => {
          const isCurrent = board?.id === currentBoard;
          return (
            <li key={board.id} className="board-item">
              <button
                type="button"
                className={`board-btn ${isCurrent && "current-board"} ${
                  isCurrent && !isOpen && "current-board-closed"
                }`}
                onClick={() => setCurrentBoard(board.id)}
              >
                <img src={board?.icon} />
                {isOpen && board?.title}
              </button>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        className="add-board-btn"
        onClick={() => dispatchBoards({ type: "OPEN_MODAL",key:"boardModal" })}
      >
        <AddCircle />
        {isOpen && "Add new board"}
      </button>

      <ThemeSwitch isOpen={isOpen} />
      {boards?.boardModal && <AddBoardModal />}
      <div className="overlay"></div>
    </aside>
  );
}

export default AsideBar;
