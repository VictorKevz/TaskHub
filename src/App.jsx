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
        [action.key]: true,
      };
    case "CLOSE_MODAL":
      return {
        ...state,
        [action.key]: false,
        userBoardName: "",
        userTaskTitle: "",
        userTaskDescription: "",
        status: "To Do",
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
    
      };
    case "DELETE_BOARD":
      return {
        ...state,
        boardsList : state.boardsList.filter((item)=> item.id !== action.id),
        
        
      }  
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
      const { currentBoard, status } = action.payload;
      const { taskId, taskName, taskDescription } = action.payload.tasks;

      // Step 1: Find the current board
      const currentBoardObj = state.boardsList.find(
        (board) => board.id === currentBoard
      );

      // Step 2: Add the new task to the appropriate column
      const updatedColumns = currentBoardObj.columns.map((column) => {
        if (column.columnTitle === status) {
          return {
            ...column,
            tasks: [...column.tasks, { taskId, taskName, taskDescription }],
          };
        }
        return column;
      });

      // Step 3: Update the board with new tasks
      const updatedBoardsList = state.boardsList.map((board) => {
        if (board.id === currentBoard) {
          return {
            ...board,
            columns: updatedColumns,
          };
        }
        return board;
      });

      // Step 4: Return the updated state
      return {
        ...state,
        boardsList: updatedBoardsList,
        taskModal: false,
        userTaskTitle: "",
        userTaskDescription: "",
      };
    case "DELETE_TASK":
      return {
        ...state,
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

    boardModal: false,
    userBoardName: "",
    taskModal: false,
    userTaskTitle: "",
    userTaskDescription: "",
    status: "To Do",
    
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
