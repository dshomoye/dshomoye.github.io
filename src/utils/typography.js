import Typography from "typography"
import lincoln from "typography-theme-lincoln"

const typography = new Typography(lincoln)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

typography.overrideThemeStyles = () => ({
  a: {
    color: 'var(--textLink)',
  },
  // gatsby-remark-autolink-headers - don't underline when hidden
  'a.anchor': {
    boxShadow: 'none',
  },
  // gatsby-remark-autolink-headers - use theme colours for the link icon
  'a.anchor svg[aria-hidden="true"]': {
    stroke: 'var(--textLink)',
  },
  hr: {
    background: 'var(--hr)',
  },
  'h1,h2,h3,h4,h5,h6':{
    color: 'var(--textNormal)'
  }
})

typography.headerColor = 'var(--textNormal)'

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
