import React from "react"
import Layout from "../components/layout"

const frameSrc =
  "https://96be89f6.sibforms.com/serve/MUIEADiGOEBJZuDcesr4WYI37V8C5y-DjIrAw7rEL-cz2Q6d2UOOeAD--wjSsD_YHSqJ8Wme_cwbrUO_539U3eHvNeCHyyae_vIFvYnCJs7SEWmlGCIvdU67EC9pXY5L_NUHk-dou9bzA8UkByqD8bYjX3wNG-CE9fpv-X94VGQ3hkRTtjdl3Fhc5vpA_7w6CBT1iq1rAuB-lXaM"

const Subscribe = ({ ...props }) => {
  const sendBlueFrame = (
    <iframe
      style={{
        width: "540px",
        maxWidth: "100%",
        maxHeight: "650px",
        height: "90vh",
        borderStyle: "none",
      }}
      src={frameSrc}
    ></iframe>
  )

  const siteTitle = props.data.site.siteMetadata.title
  console.log("body classes ", document.body.classList)
  return (
    <Layout location={props.location} title={siteTitle}>
      <h2>Fill the form below to subscribe.</h2>
      <div>{sendBlueFrame}</div>
    </Layout>
  )
}

export default Subscribe

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
