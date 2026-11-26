# Yuhan's Mini (messy) Universe

A personal homepage and flower collection, with a 19-page bilingual photo manga: Reuniting with Grandma Across Time. No build or installation is needed.

## Publish on GitHub Pages

1. Sign in to your own GitHub account.
2. Create a public repository named `YOUR-USERNAME.github.io`, replacing `YOUR-USERNAME` with your actual GitHub username.
3. Upload the contents of this folder to the root of the repository, keeping the `assets` and `grandma` folders intact.
4. Open repository **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select the `main` branch and `/ (root)`, then save.
5. GitHub will show the website URL when publication is ready. It will normally be `https://YOUR-USERNAME.github.io`.

The homepage is `index.html`; its styling is `style.css`. The orchid links to `grandma/`, which contains the comic reader, 19 optimized page images, and the complete PDF. Each future project can live in its own folder with an `index.html` file. All links are relative.

The comic reader runs entirely in the browser. Chapters can be opened directly with `grandma/?chapter=0` through `grandma/?chapter=18`; browser history and keyboard navigation are supported. The old `constellation/` demo address redirects to the comic. Fonts are requested from Google Fonts with local fallbacks.
