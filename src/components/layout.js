import React from "react"
import { Link } from "gatsby"
import ProgressBar from "react-scroll-progress-bar"

import ThemeSwitch from "./ThemeSwitch"
import QuoteBlock from "./QuoteBlock"
import { rhythm, scale } from "../utils/typography"
import { Helmet } from "react-helmet"

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
            backgroundColor: "var(--bg)",
            color: "var(--textNormal)",
            transition: "color 0.2s ease-out, background 0.2s ease-out",
            marginLeft: `auto`,
            marginRight: `auto`,
            maxWidth: rhythm(24),
            padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
          }}
        >
          <header> {header} </header> <main> {children} </main> <QuoteBlock />
          <div
            style={{
              textAlign: "center",
            }}
          >
            <footer>
              {" "}
              ©{new Date().getFullYear()} Adedamola Shomoye |{"  "}
              <a href="/rss.xml">
                {" "}
                {` `}RSS {` `}{" "}
              </a>
              |<Link to="/subscribe">{`  `}Newsletter</Link>
            </footer>
            <ThemeSwitch />
          </div>
        </div>
        <Helmet>
          <script type="text/javascript">
            {`console.log('tracking code init')          
              var _tcfg = _tcfg || [];
              (function() {
                _tcfg.push(["tags", ""]);
                var u="https://cdn.ticksel.com/js/analytics_v1.0.js"; _tcfg.push(["account_id", 5427524]);
                var d=document, g=d.createElement("script"), s=d.getElementsByTagName("script")[0];
                g.type="text/javascript"; g.async=true; g.src=u; g.setAttribute("crossorigin", "anonymous");
                g.setAttribute("integrity", "sha256-7grd8jMivCG0iCcJ7m/Ny4gvWb0mPVpFhRQovLkaUl8=");
                s.parentNode.insertBefore(g,s);
              })(); 
            `}
          </script>
        </Helmet>
      </div>
    )
  }
}

export default Layout
