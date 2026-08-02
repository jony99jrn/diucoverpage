# DIU Cover Page Generator

Fill in your assignment details once and get a print-ready DIU cover page you
can download as a PDF. Plain HTML, CSS, and JavaScript — no framework, no
build step, no npm install required.

## Project structure

```
diu-cover-generator/
├── index.html            Page structure and script/style loading
├── css/
│   ├── variables.css      Color, type, and spacing tokens
│   ├── base.css           Reset and base typography
│   ├── layout.css         Header + two-pane grid
│   ├── form.css           Draft form pane styling
│   ├── preview.css        Document preview pane, seal, dot-leader rows
│   └── responsive.css     Mobile layout + Edit/Preview tab switch
├── js/
│   ├── state.js           Field config + form state (single source of truth)
│   ├── render.js          Builds the form and preview DOM, keeps them in sync
│   ├── pdf.js             Exports the preview as a PDF
│   └── main.js            Wires everything together on load
└── assets/icons/           SVG icons (book, teacher, student, calendar, seal)
```

Add a new field by editing the `FIELD_GROUPS` array in `js/state.js` — the
form and the live preview both render from that one config, so nothing else
needs to change.

## Running it locally

Because `render.js` fetches the icon SVGs, opening `index.html` directly as a
`file://` URL won't work in most browsers (fetch is blocked from `file://`).
Serve the folder over HTTP instead:

```
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploying

**GitHub Pages**
1. Push this folder to a GitHub repository.
2. In the repo, go to Settings → Pages → Deploy from a branch, pick `main`
   and the root folder.
3. Your site is live at `https://<username>.github.io/<repo>/`.

**Vercel**
1. Push the same repository to GitHub.
2. In Vercel, "Add New Project" → import the repo.
3. Framework preset: "Other" (it's a static site — no build command needed).
4. Deploy.

No environment variables or config files are required either way.
