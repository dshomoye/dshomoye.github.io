import React, { useEffect, useState } from "react"
import { Link } from "gatsby"

import { rhythm, scale } from "../utils/typography"

const QuoteBlock = () => {
  const [quote, setQuote] = useState(null)

  useEffect(() => {
    const getJoke = async () => {
      try {
        const quoteResponse = await fetch('https://quote-garden.herokuapp.com/quotes/random')
        const quoteData = await quoteResponse.json()
        setQuote({
          author: quoteData.quoteAuthor,
          text: quoteData.quoteText
        })
      } catch (e) {
        console.log("Unable to fetch joke from api ", e)
      }
    }
    getJoke()
  }, [])

  if(!quote) return null
  return (
    <>
      <hr/>
  <p style={{fontSize: 'small'}}><strong>{quote.author}:</strong> {quote.text}</p>
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
        <QuoteBlock/>
        <footer>© {new Date().getFullYear()} Adedamola Shomoye | <a href="/rss.xml">RSS</a>.</footer>
      </div>
    )
  }
}

export default Layout
