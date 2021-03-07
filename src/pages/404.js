import React, { Suspense, lazy } from "react"
import { graphql, Link } from "gatsby"
const Lottie = lazy(() => import("react-lottie"))

import Layout from "../components/layout"
import SEO from "../components/seo"
import animationData from "../lotties/404.json"

const NotFoundPage = (props) => {
  const { data } = props
  const siteTitle = data.site.siteMetadata.title
  const isSSR = typeof window === "undefined"

  return (
    <Layout location={props.location} title={siteTitle}>
      <SEO title="404: Not Found" />
      <Link to="/">
        {!isSSR && (
          <Suspense fallback={<h3>Page was not found...</h3>}>
            <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData,
                rendererSettings: {
                  preserveAspectRatio: "xMidYMid slice",
                },
              }}
            />
          </Suspense>
        )}
        <p>This page is not real, you imagined it.</p>
        <p>Go Home.</p>
      </Link>
    </Layout>
  )
}

export default NotFoundPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
