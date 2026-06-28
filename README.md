# Sai Srinath — Portfolio

React portfolio site. Bold dark theme with violet accent, typewriter effect, animated sections, and 6 IAM project cards.

## Quick start

```bash
npm install
npm start        # dev server at http://localhost:3000
npm run build    # production build → /build
```

## Deployment options

### Vercel (recommended — free, fast)
1. Push this folder to a GitHub repo
2. Go to https://vercel.com → Import project → select your repo
3. Framework: Create React App — deploy ✓

### Netlify (free)
1. Push to GitHub
2. Go to https://netlify.com → Add new site → Import from Git
3. Build command: `npm run build` · Publish dir: `build` — deploy ✓

### GitHub Pages
```bash
npm install --save-dev gh-pages
# Add to package.json "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO"
# Add scripts: "predeploy": "npm run build", "deploy": "gh-pages -d build"
npm run deploy
```

## Personalise before deploying

Edit `src/App.jsx`:

| What to change | Where |
|---|---|
| Your email | `Contact` component — `email` const |
| LinkedIn / GitHub URLs | `Contact` component — links array |
| Years of experience | `Hero` stats row |
| Project descriptions | `projects` array |
| Skills list | `skillGroups` array |
