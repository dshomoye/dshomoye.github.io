import React from "react"
import { Link } from "gatsby"
import ProgressBar from "react-scroll-progress-bar"
import Notifications from "react-notify-toast"
import PropTypes from "prop-types"

import ThemeSwitch from "./ThemeSwitch"
import QuoteBlock from "./QuoteBlock"
import SubscribeOptions from "./SubscribeOptions"

class Layout extends React.Component {
  render() {
    const { location, title, children, fullWidth, heading } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    let header

    const containerWidth = fullWidth ? '100%' : '38rem'

    if (location.pathname === rootPath) {
      header = (
        <h1
          style={{
            fontSize: `2rem`,
            marginBottom: `2rem`,
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
            {title}{" "}
          </Link>{" "}
        </h1>
      )
    } else {
      header = (
        <h3
          style={{
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
            {title}{" "}
          </Link>{" "}
        </h3>
      )
    }
    return (
      <div>
        <Notifications options={{ timeout: 1500 }} />
        <ProgressBar bgcolor="#757575" />
        <div
          style={{
            backgroundColor: "var(--bg)",
            color: "var(--textNormal)",
            transition: "color 0.2s ease-out, background 0.2s ease-out",
            marginLeft: `auto`,
            marginRight: `auto`,
            maxWidth: containerWidth,
            padding: `2rem 1rem`,
          }}
        >
          <header> {header} </header>
          <main> {children} </main>
          <QuoteBlock />
          <div
            style={{
              textAlign: "center",
            }}
          >
            <footer>
              {" "}
              ©{new Date().getFullYear()} Adedamola Shomoye {"  "}
              <SubscribeOptions />
            </footer>
            <ThemeSwitch />
          </div>
        </div>
      </div>
    )
  }
}

Layout.propTypes = {
  location: PropTypes.object,
  title: PropTypes.string,
  children: PropTypes.array,
  fullWidth: PropTypes.bool
}

export default Layout
