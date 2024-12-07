import { Check, Close } from "@mui/icons-material";
import React, { useContext, useState } from "react";
import { DataContext } from "../../App";
import { logoData } from "../../logoData";
import "./addBoardModal.css";
import uuid from "react-uuid";

function AddBoardModal() {
  const { boards, dispatchBoards } = useContext(DataContext);

  const [isNameValid, setNameValid] = useState(true);
  const [isLogoValid, setLogoValid] = useState(true);
  const [isColumnValid, setColumnValid] = useState(true);

  const [iconIndex, setIconIndex] = useState(null);
  const columns = ["To Do", "In Progress", "Completed"];
  const [selectedColumns, setSelectedColumns] = useState(["To Do"]);

  const updateColumns = (column) => {
    setColumnValid(true);
    setSelectedColumns((prevColumns) => {
      const isSelected = prevColumns.includes(column);
      if (isSelected) {
        return prevColumns.filter((item) => item !== column);
      } else {
        return [...prevColumns, column];
      }
    });
  };
  const handleCreate = () => {
    if (
      !boards?.userBoardName.trim() ||
      boards?.userBoardName.length < 3 ||
      iconIndex === null ||
      selectedColumns?.length === 0
    ) {
      setNameValid(false);
      setLogoValid(false);
      setColumnValid(false);
      return;
    } else {
      dispatchBoards({
        type: "ADD_NEW_BOARD",
        payload: {
          id: uuid(),
          title: boards?.userBoardName,
          icon: logoData[iconIndex],
          columns: selectedColumns.map((item) => ({
            columnId: uuid(),
            columnTitle: item,
            tasks: [],
          })),
        },
      });
    }
  };
  return (
    <div className="modal-wrapper">
      <article className="modal-container">
        <header className="modal-header">
          <h2 className="text-2xl title">New Board</h2>
          <button
            type="button"
            className="close-modal-btn"
            onClick={() =>
              dispatchBoards({ type: "CLOSE_MODAL", key: "boardModal" })
            }
          >
            <Close className="text-2xl" />
          </button>
        </header>

        {/*
         *
         *
         * Board Name
         *
         *
         */}
        <label htmlFor="boardName" className="board-label">
          Board name
        </label>
        <input
          type="text"
          id="boardName"
          value={boards?.userBoardName}
          className={`board-input ${!isNameValid && "border-error"}`}
          onChange={(e) => {
            dispatchBoards({
              type: "UPDATE_BOARD_INPUT",
              value: e.target.value,
            });
            setNameValid(true);
          }}
          placeholder="eg Default Board."
        />
        {!isNameValid && (
          <span className="text-xs text-crimson">
            Can't be empty nor too short!
          </span>
        )}
        {/*
         *
         *
         * Choosing Logos
         *
         *
         */}
        <ul className="logos-wrapper">
          <li className="logo-header">
            Choose Logo
            {!isLogoValid && (
              <span className="text-xs text-crimson">
                Select at least one logo!
              </span>
            )}
          </li>
          {logoData.map((logo, i) => {
            const isSelected = iconIndex === i;
            return (
              <li key={i} className="logo-item">
                <button
                  type="button"
                  className={`icon-btn ${isSelected && "selected"}`}
                  onClick={() => {
                    setIconIndex(i);
                    setLogoValid(true);
                  }}
                >
                  <img
                    src={logo}
                    alt=""
                    className={`logo-icon `}
                  />
                </button>
              </li>
            );
          })}
        </ul>
        {/*
         *
         *
         * Choosing columns
         *
         *
         */}
        <ul className="columns-wrapper">
          <li className="column-header">
            Choose Columns
            {!isColumnValid && (
              <span className="text-xs text-crimson">
                Select at least one column!
              </span>
            )}
          </li>
          {columns.map((column, i) => {
            const isSelected = selectedColumns.includes(column);
            return (
              <li key={i} className="column-item">
                <button
                  type="button"
                  className={`column-btn ${isSelected && "chosen"}`}
                  onClick={() => updateColumns(column)}
                >
                  {column}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="actions-wrapper">
          <button type="button" className="btn create" onClick={handleCreate}>
            Create board <Check />
          </button>
          <button
            type="button"
            className="btn cancel"
            onClick={() =>
              dispatchBoards({ type: "CLOSE_MODAL", key: "boardModal" })
            }
          >
            Cancel
          </button>
        </div>
      </article>
    </div>
  );
}

export default AddBoardModal;
