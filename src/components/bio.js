import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image";

const Bio = () => {
  const data = useStaticQuery(graphql`query BioQuery {
  site {
    siteMetadata {
      author
    }
  }
}
`)

  const { author } = data.site.siteMetadata
  return (
    <div
      style={{
        display: `flex`,
        marginBottom: `3rem`,
        alignItems: `center`,
      }}
    >
      <StaticImage
        src="../../content/assets/damola.png"
        alt={author}
        style={{
          marginRight: `0.7rem`,
          marginBottom: 0,
          minWidth: 50,
          borderRadius: `100%`,
        }}
        width={50}
        height={50}
        imgStyle={{
          borderRadius: `50%`,
        }} />
      <p style={{ marginBottom: 0 }}>
        By <Link to="/about"><strong>{author}</strong></Link>
      </p>
    </div>
  );
}

export default Bio
