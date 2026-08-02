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
└── assets/
    ├── icons/              SVG icons for the draft form (book, teacher, student, calendar)
    └── images/             Real letterhead assets: top.svg (logo lockup), center.svg (watermark crest)
```
