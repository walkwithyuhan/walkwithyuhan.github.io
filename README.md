# Yuhan's Mini (messy) Universe

A personal homepage and a playable constellation toy. No build or installation is needed. Upload the contents of this folder to a GitHub repository to use GitHub Pages.

## Publish on GitHub Pages

1. Sign in to your own GitHub account.
2. Create a public repository named `YOUR-USERNAME.github.io`, replacing `YOUR-USERNAME` with your actual GitHub username.
3. Upload the contents of this folder to the root of the repository, keeping the `constellation` folder intact.
4. Open repository **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select the `main` branch and `/ (root)`, then save.
5. GitHub will show the website URL when publication is ready. It will normally be `https://YOUR-USERNAME.github.io`.

The homepage is `index.html`; its styling is `style.css`. Each future browser project can live in its own folder with an `index.html` file, just like `constellation/`. Add a link to the new folder on the homepage. All links are relative so this also works on a repository project site.

The constellation toy runs entirely in the browser. Downloaded drawings stay on the visitor's device; drawings are not stored on a server. Fonts are requested from Google Fonts with local font fallbacks when unavailable.
