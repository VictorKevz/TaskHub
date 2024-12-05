import React, { useContext, useEffect, useState } from "react";
import { DarkMode, LightMode } from "@mui/icons-material";
import { AppThemeContext } from "../../App";
import "./themeSwitch.css";

function ThemeSwitch({ isOpen }) {
  const { isDark, setDark } = useContext(AppThemeContext);

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(isDark));
  }, [isDark]);
  return (
    <div className="theme-wrapper">
      {isOpen ? (
        <div className="open-theme-wrapper">
          <button
            type="button"
            className={`open-theme-btn ${isDark && "active"}`}
            onClick={() => setDark(true)}
          >
            <DarkMode /> Dark
          </button>

          <button
            type="button"
            className={`open-theme-btn ${!isDark && "active"}`}
            onClick={() => setDark(false)}
          >
            <LightMode /> Light
          </button>
        </div>
      ) : (
        <button className="closed-theme--btn" onClick={() => setDark(!isDark)}>
          {isDark ? <DarkMode /> : <LightMode />}
        </button>
      )}
    </div>
  );
}

export default ThemeSwitch;
