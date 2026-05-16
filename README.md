## My Astro powered blog.

[![Netlify Status](https://api.netlify.com/api/v1/badges/428bfc02-50ae-4481-adf2-50765cddb5f6/deploy-status)](https://app.netlify.com/sites/dshomoye/deploys)

[Live version](https://dshomoye.dev), deployed on Netlify.

- Static Astro site backed by Markdown content in a private submodule.
- Netlify Functions support optional likes.
- No analytics provider is bundled.

## Development

- `npm install` from root
- `npm install` from `functions`
- Initialize the content submodule if you have access:
  - `git submodule update --init --recursive`
- `npm run dev` to start a dev server.
- `npm run build` to build the Netlify artifact in `dist`.

The actual blog posts are in a different repo, referenced as a submodule in the `content` directory. The site expects posts under `content/blog` and assets under `content/assets`.
