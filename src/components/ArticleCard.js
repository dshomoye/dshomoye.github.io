import React from "react"
import { Link } from "gatsby"
import TagPills from "./TagPills"
import { GatsbyImage } from "gatsby-plugin-image"

const ArticleCard = ({ title, slug, date, excerpt, tags, fluid, src }) => {
  return (
    <article
      className="card-article flex"
      data-sal="slide-up"
      data-sal-easing="ease"
      data-sal-duration="700"
      key={slug}
    >
      <div className="article-item article-content">
        <Link className="home-article-link" to={slug}>
          <header>
            <h3>{title}</h3>
            <small style={{ backgroundColor: "None" }}>{date}</small>
          </header>
          <section>
            <p
              dangerouslySetInnerHTML={{
                __html: excerpt,
              }}
            />
          </section>
        </Link>
        <TagPills tagNames={tags} />
      </div>
      {fluid && (
        <Link to={slug} className="article-item banner-container">
          <GatsbyImage
            image={fluid}
            className="banner-image"
            durationFadeIn={100}
            imgClassName="article-image"
          />
        </Link>
      )}
      {src && (
        <Link to={slug} className="article-item banner-container">
          <img data-src={src} alt={title} className="banner-image lazyload" />
        </Link>
      )}
    </article>
  )
}

export default ArticleCard
