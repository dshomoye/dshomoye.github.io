import React from "react"
import { Link } from "gatsby"
import ProgressBar from "react-scroll-progress-bar";

import ThemeSwitch from "./ThemeSwitch"
import QuoteBlock from "./QuoteBlock"
import { rhythm, scale } from "../utils/typography"

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    let header

    if (location.pathname === rootPath) {
      header = (
        <h1
          style={{
            ...scale(1.5),
            marginBottom: rhythm(1.5),
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
            fontFamily: `Montserrat, sans-serif`,
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
      <ProgressBar bgcolor="#757575" />
      <div
        style={{
          backgroundColor: 'var(--bg)',
          color: 'var(--textNormal)',
          transition: 'color 0.2s ease-out, background 0.2s ease-out',
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
        >
        <header> {header} </header> <main> {children} </main> <QuoteBlock />
        <div
          style={{
            textAlign: 'center',
          }}
          >
          <footer>
            {" "}
        ©{new Date().getFullYear()}{' '}Adedamola Shomoye{' '}|{'  '}<a href="/rss.xml"> RSS </a>
          </footer>
          <ThemeSwitch />
        </div>
      </div>
      </div>
    )
  }
}

export default Layout
