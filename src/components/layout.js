import React, { useEffect, useState } from "react"
import { Link } from "gatsby"

import { rhythm, scale } from "../utils/typography"

const CNJoke = () => {
  const [joke, setJoke ] = useState(null);

  useEffect(() => {
    const getJoke = async () => {
      try {
        const response = await fetch('https://api.icndb.com/jokes/random')
        const data = await response.json()
        setJoke(data.value.joke)
      } catch (e) {
        console.log("Unable to fetch joke from api ", e)
      }
    }
    getJoke()
  }, [])

  if(!joke) return null
  return (
    <>
      <hr/>
      <p style={{fontSize: 'small'}}>{joke}</p>
    </>
    )

}

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
            {title}
          </Link>
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
            {title}
          </Link>
        </h3>
      )
    }
    return (
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        <header>{header}</header>
        <main>{children}</main>
        <CNJoke/>
        <footer>© {new Date().getFullYear()} dshomoye.</footer>
      </div>
    )
  }
}

export default Layout
