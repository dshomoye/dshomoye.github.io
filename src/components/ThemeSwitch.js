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
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p className="switchText">{theme === "dark" ? "...Dark Side" : "Join the..."}</p>
          <label className="switch">
            <input
              type="checkbox"
              onChange={(e) => toggleTheme(e.target.checked ? "dark" : "light")}
              checked={theme === "dark"}
              id="themeswitch"
              aria-label="themeswitch"
              tabIndex={0}
            />
            <span className="slider round"></span> <br />
          </label>
        </div>
      )}
    </ThemeToggler>
  )
}

export default ThemeSwitch
