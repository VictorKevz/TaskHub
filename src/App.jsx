import { createContext, useEffect, useReducer, useState } from "react";
import defaultIcon from "./assets/images/default.svg";

import "./App.css";
import AsideBar from "./components/AsideBar/AsideBar";
import uuid from "react-uuid";
import MainBoard from "./components/MainBoard/MainBoard";

export const AppThemeContext = createContext();
export const DataContext = createContext();

const boardReducer = (state, action) => {
  switch (action.type) {
    case "OPEN_MODAL":
      return {
        ...state,
        [action.payload.key]: true,
        modalData: {
          taskId: action.payload?.modalData?.taskId,
          taskName: action.payload?.modalData?.taskName,
          taskDescription: action.payload?.modalData?.taskDescription,
          columnId: action.payload?.modalData?.columnId,
          columnTitle: action.payload?.modalData?.columnTitle,
        },
      };
    case "CLOSE_MODAL":
      return {
        ...state,
        [action.key]: false,
        userBoardName: "",
        userTaskTitle: "",
        userTaskDescription: "",
        status: "To Do",
        modalData: {},
      };
    case "UPDATE_BOARD_INPUT":
      return {
        ...state,
        userBoardName: action.value,
      };
    case "ADD_NEW_BOARD":
      const { id, title, icon, columns } = action.payload;
      return {
        ...state,
        boardsList: [...state.boardsList, { id, title, icon, columns }],
        userBoardName: "",
        boardModal: false,
        selectedBoard: id,
      };
    case "DELETE_BOARD":
      return {
        ...state,
        boardsList: state.boardsList.filter((item) => item.id !== action.id),
        boardWarningModal: false,
        selectedBoard:
          state.boardsList?.length > 0 ? state.boardsList?.[0]?.id : null,
      };
    case "UPDATE_BOARD":
      return {
        ...state,
        selectedBoard: action.id,
      };
    case "UPDATE_TASKS_INPUT":
      const { name, value } = action.payload;
      return {
        ...state,
        [name]: value,
      };
    case "UPDATE_TASKS_STATUS":
      return {
        ...state,
        status: action.status,
      };
    case "ADD_NEW_TASK":
      const { updatedBoard } = action.payload;
      const updatedBoardList = state.boardsList.map((board) =>
        board.id === updatedBoard.id ? updatedBoard : board
      );
      return {
        ...state,
        boardsList: updatedBoardList,
        taskModal: false,
        editTaskModal: false,
        userTaskTitle: "",
        userTaskDescription: "",
        status: "To Do",
      };
    case "DELETE_TASK":
      const { taskId, boardId, columnId } = action.payload;
      // STEP 1: Find the current board
      const currentBoard = state.boardsList.find((obj) => obj.id === boardId);

      //STEP 2: Update the appropriate column & copy prev columns
      const updatedColumns = currentBoard.columns.map((column) => {
        if (column.columnId === columnId) {
          return {
            ...column,
            tasks: column.tasks.filter((task) => task.taskId !== taskId),
          };
        }
        return column;
      });
      //STEP 3: Update the entire board with the updated columns
      const updatedBoardDelete = state.boardsList.map((board) => {
        if (board.id === boardId) {
          return {
            ...board,
            columns: updatedColumns,
          };
        }
        return board;
      });
      // Finally return state.
      return {
        ...state,
        boardsList: updatedBoardDelete,
        taskWarningModal: false,
      };
    case "EDIT_TASK":
      const { updatedBoardObj } = action.payload;
      const updatedBoardEdit = state.boardsList.map((board) =>
        board.id === updatedBoardObj.id ? updatedBoardObj : board
      );
      return {
        ...state,
        boardsList:updatedBoardEdit,
        editTaskModal: false,
      };
    default:
      return state;
  }
};

function App() {
  const [isDark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? JSON.parse(savedTheme) : true;
  });

  {
    /* 
    BOARDS Reducer declaration
    *
    *
    * 
    * 
    */
  }
  const savedBoardData = localStorage.getItem("boards");
  const initialBoardsData = {
    boardsList: savedBoardData
      ? JSON.parse(savedBoardData)
      : [
          {
            id: 0,
            title: "Default Board",
            icon: defaultIcon,
            columns: [
              {
                columnId: uuid(),
                columnTitle: "To Do",
                tasks: [
                  {
                    taskId: uuid(),
                    taskName: "Task 1",
                    taskDescription: "The description of task 1",
                    tags: ["thesis", "school", "academic"],
                  },
                ],
              },
              {
                columnId: uuid(),
                columnTitle: "In Progress",
                tasks: [],
                tags: [],
              },
              {
                columnId: uuid(),
                columnTitle: "Completed",
                tasks: [],
                tags: [],
              },
            ],
          },
        ],
    selectedBoard: 0,
    boardModal: false,
    userBoardName: "",
    taskModal: false,
    editTaskModal: false,
    userTaskTitle: "",
    userTaskDescription: "",
    status: "To Do",
    taskWarningModal: false,
    boardWarningModal: false,
    modalData: {},
  };
  const [boards, dispatchBoards] = useReducer(boardReducer, initialBoardsData);
  const [currentBoard, setCurrentBoard] = useState(0);

  useEffect(() => {
    localStorage.setItem("boards", JSON.stringify(boards?.boardsList));
  }, [boards?.boardsList]);

  return (
    <AppThemeContext.Provider value={{ isDark, setDark }}>
      <DataContext.Provider
        value={{ boards, dispatchBoards, currentBoard, setCurrentBoard }}
      >
        <main className="bg-charcoal w-full min-h-screen flex items-start justify-start">
          <AsideBar />
          <MainBoard />
        </main>
      </DataContext.Provider>
    </AppThemeContext.Provider>
  );
}

export default App;
