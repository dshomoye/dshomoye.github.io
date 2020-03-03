import React from "react"
import { Link } from "gatsby"
import ProgressBar from "react-scroll-progress-bar"
import { Helmet } from "react-helmet"
import Notifications from "react-notify-toast"

import ThemeSwitch from "./ThemeSwitch"
import QuoteBlock from "./QuoteBlock"
import SubscribeOptions from "./SubscribeOptions"

const ticksel_tag =
  process.env.development === "1" ? "development" : "production"

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    let header

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
        <Notifications />
        <ProgressBar bgcolor="#757575" />
        <div
          style={{
            backgroundColor: "var(--bg)",
            color: "var(--textNormal)",
            transition: "color 0.2s ease-out, background 0.2s ease-out",
            marginLeft: `auto`,
            marginRight: `auto`,
            maxWidth: `38rem`,
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
        <Helmet>
          <script type="text/javascript">
            {`       
              var _tcfg = _tcfg || [];
              (function() {
                _tcfg.push(["tags", "${ticksel_tag}"]);
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
