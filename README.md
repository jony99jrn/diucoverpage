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
