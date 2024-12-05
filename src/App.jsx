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
      case "UPDATE_TASKS_INPUT":
        const{name,value} = action.payload
        return {
          ...state,
          [name]:value,
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
                    taskName: "Write Thesis",
                    taskDescription:
                      "I should write 2 pages for the introduction part!",
                    tags: ["thesis,school,academic"],
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
