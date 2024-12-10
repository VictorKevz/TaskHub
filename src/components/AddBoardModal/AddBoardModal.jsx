import { Check, Close } from "@mui/icons-material";
import React, { useContext, useState } from "react";
import { DataContext } from "../../App";
import { logoData } from "../../logoData";
import "./addBoardModal.css";
import uuid from "react-uuid";

function AddBoardModal({ host, boardTitle }) {
  const { boards, dispatchBoards } = useContext(DataContext);

  const currentObj = boards?.boardsList.find(
    (obj) => obj.id === boards?.selectedBoard
  );
  const [isNameValid, setNameValid] = useState(true);
  const [isLogoValid, setLogoValid] = useState(true);
  const [isColumnValid, setColumnValid] = useState(true);

  const [iconIndex, setIconIndex] = useState(null);
  const columns = ["To Do", "In Progress", "Completed"];
  const [selectedColumns, setSelectedColumns] = useState(["To Do"]);

  const [editBoard, setEditBoard] = useState(boardTitle);
  const [editIcon, setEditIcon] = useState(currentObj.icon);
  const chosenColumns = currentObj?.columns?.map(
    (column) => column.columnTitle
  );
  const [editColumn, setEditColumn] = useState(chosenColumns);

  const updateColumns = (column) => {
    const setter = host === "add" ? setSelectedColumns : setEditColumn;

    setter((prevColumns) => {
      const isSelected = prevColumns.includes(column);
      if (isSelected) {
        return prevColumns.filter((item) => item !== column);
      } else {
        return [...prevColumns, column];
      }
    });
    setColumnValid(true);
  };

  const validate = (boardName, logo, columns) => {
    let isValid = true;
    if (!boardName.trim() || boardName.length < 3) {
      setNameValid(false) ;
      isValid = false;
      return;
    }
    if (logo === null) {
      setLogoValid(false) ;
      isValid = false;
      return;
    }
    if (columns?.length === 0) {
      setColumnValid(false) ;
      isValid = false;
      return;
    }
    return isValid;
  };
  const handleCreate = () => {
    if (validate(boards?.userBoardName, iconIndex, selectedColumns)) {
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

  const handleEdit = () => {
    if (validate(editBoard, editIcon, editColumn)) {
      dispatchBoards({
        type: "EDIT_BOARD",
        payload: {
          id: currentObj.id,
          title: editBoard,
          icon: editIcon,
          columns: editColumn.map((columnTitle) => {
            const existingColumn = currentObj.columns.find(
              (col) => col.columnTitle === columnTitle
            );
            return (
              existingColumn || {
                columnId: uuid(),
                columnTitle,
                tasks: [], 
              }
            );
          }),
        },
      });
    }
  };
  return (
    <div className="modal-wrapper">
      <article className="modal-container">
        <header className="modal-header">
          <h2 className="text-2xl title">
            {host === "add" ? "New Board" : "Edit Board"}
          </h2>
          <button
            type="button"
            className="close-modal-btn"
            onClick={() =>
              dispatchBoards({
                type: "CLOSE_MODAL",
                key: host === "add" ? "boardModal" : "editBoardModal",
              })
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
          value={host === "add" ? boards?.userBoardName : editBoard}
          className={`board-input ${!isNameValid && "border-error"}`}
          onChange={(e) => {
            host === "add"
              ? dispatchBoards({
                  type: "UPDATE_BOARD_INPUT",
                  value: e.target.value,
                })
              : setEditBoard(e.target.value);
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
            {host === "add" ? "Choose Logo" : "Edit Logo"}
            {!isLogoValid && (
              <span className="text-xs text-crimson">
                Select at least one logo!
              </span>
            )}
          </li>
          {logoData.map((logo, i) => {
            const isSelected =
              host === "add" ? iconIndex === i : editIcon === logo;
            return (
              <li key={i} className="logo-item">
                <button
                  type="button"
                  className={`icon-btn ${isSelected && "selected"}`}
                  onClick={() => {
                    host === "add" ? setIconIndex(i) : setEditIcon(logo);

                    setLogoValid(true);
                  }}
                >
                  <img src={logo} alt="" className={`logo-icon `} />
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
          {columns?.map((column, i) => {
            const isSelected =
              host === "add"
                ? selectedColumns.includes(column)
                : editColumn.includes(column);
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
          <button
            type="button"
            className="btn create"
            onClick={host === "add" ? handleCreate : handleEdit}
          >
            {host === "add" ? `Create board` : "Save changes"} <Check />
          </button>
          <button
            type="button"
            className="btn cancel"
            onClick={() =>
              dispatchBoards({
                type: "CLOSE_MODAL",
                key: host === "add" ? "boardModal" : "editBoardModal",
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

export default AddBoardModal;
