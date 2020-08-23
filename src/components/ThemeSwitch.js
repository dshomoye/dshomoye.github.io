import React from "react"
import { ThemeToggler } from "gatsby-plugin-dark-mode"

import "../styles/ThemeSwitch.css"

const ThemeSwitch = () => {
  return (
    <ThemeToggler>
      {({ theme, toggleTheme }) => (
        <div
          style={{
            fontSize: "0.7em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {theme === "dark" ? "" : "Join the..."}
          <label className="switch">
            <input
              type="checkbox"
              onChange={e => toggleTheme(e.target.checked ? "dark" : "light")}
              checked={theme === "dark"}
              id="themeswitch"
              aria-label="themeswitch"
            />
            <span className="slider round"></span> <br />
          </label>
          {theme === "dark" ? "...Dark Side" : ""}
        </div>
      )}
    </ThemeToggler>
  )
}

export default ThemeSwitch
