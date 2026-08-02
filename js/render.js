// Builds the draft form and the document preview from FIELD_GROUPS,
// then keeps the preview in sync with whatever the state holds.

const ICON_CACHE = {};

// Pins .document to an explicit pixel height in true A4 proportion
// (297/210). We can't rely on the CSS `aspect-ratio` property alone —
// the browser preview honors it, but the html2canvas step used for the
// PDF export does not reliably replicate it during capture, which was
// causing the exported page to come out stretched. A plain pixel height
// is respected identically by both the live preview and the capture.
function lockDocumentToA4() {
  const doc = document.querySelector('.document');
  if (!doc) return;
  const width = doc.getBoundingClientRect().width;
  if (width > 0) {
    doc.style.height = `${width * (297 / 210)}px`;
  }
}

async function loadIcon(name) {
  if (ICON_CACHE[name]) return ICON_CACHE[name];
  const res = await fetch(`assets/icons/${name}.svg`);
  const markup = await res.text();
  ICON_CACHE[name] = markup;
  return markup;
}

function formatDateForDoc(isoDate) {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const [y, m, d] = parts;
  return `${d}/${m}/${y}`;
}

async function buildForm(root) {
  root.innerHTML = '';
  for (const group of FIELD_GROUPS) {
    const section = document.createElement('section');
    section.className = 'field-section';

    const head = document.createElement('div');
    head.className = 'field-section__head';
    head.innerHTML = await loadIcon(group.icon);
    const h2 = document.createElement('h2');
    h2.textContent = group.title;
    head.appendChild(h2);
    section.appendChild(head);

    const grid = document.createElement('div');
    grid.className = 'field-grid';

    for (const field of group.fields) {
      const wrap = document.createElement('div');
      wrap.className = 'field' + (field.full ? ' field--full' : '');
      if (field.mono) wrap.dataset.mono = '';

      const label = document.createElement('label');
      label.setAttribute('for', field.id);
      label.textContent = field.label;

      const input = document.createElement('input');
      input.id = field.id;
      input.name = field.id;
      input.type = field.type || 'text';
      if (field.placeholder) input.placeholder = field.placeholder;
      input.value = CoverState.get(field.id);
      input.addEventListener('input', () => {
        CoverState.set(field.id, input.value);
        updatePreview();
      });

      wrap.appendChild(label);
      wrap.appendChild(input);
      grid.appendChild(wrap);
    }

    section.appendChild(grid);
    root.appendChild(section);
  }
}

function buildPreviewRows(root) {
  root.innerHTML = '';
  const groups = FIELD_GROUPS.filter((g) => g.id !== 'date');

  for (const group of groups) {
    const block = document.createElement('div');
    block.className = 'document__group';

    if (group.heading) {
      const heading = document.createElement('div');
      heading.className = 'document__heading';
      heading.textContent = group.heading;
      block.appendChild(heading);
    }

    for (const field of group.fields) {
      const row = document.createElement('div');
      row.className = 'doc-row';
      row.dataset.field = field.id;

      const label = document.createElement('span');
      label.className = 'doc-row__label';
      label.textContent = field.docLabel + (field.noColon ? '' : ':');

      const value = document.createElement('span');
      value.className = 'doc-row__value';

      row.appendChild(label);
      row.appendChild(value);
      block.appendChild(row);
    }

    if (group.footerLine) {
      const footer = document.createElement('div');
      footer.className = 'document__footer-line';
      footer.textContent = group.footerLine;
      block.appendChild(footer);
    }

    root.appendChild(block);
  }
}

function updatePreview() {
  document.querySelectorAll('.doc-row').forEach((row) => {
    const fieldId = row.dataset.field;
    const raw = CoverState.get(fieldId);
    const valueEl = row.querySelector('.doc-row__value');

    if (raw) {
      valueEl.textContent = raw;
      valueEl.classList.remove('is-empty');
    } else {
      const group = FIELD_GROUPS.find((g) => g.fields.some((f) => f.id === fieldId));
      const field = group.fields.find((f) => f.id === fieldId);
      valueEl.textContent = field.placeholder ? field.placeholder : '—';
      valueEl.classList.add('is-empty');
    }
  });

  const rawDate = CoverState.get('submissionDate');
  const dateEl = document.getElementById('previewDate');
  if (dateEl) {
    const display = formatDateForDoc(rawDate);
    dateEl.textContent = display || 'dd/mm/yyyy';
    dateEl.classList.toggle('is-empty', !display);
  }

  updateCompleteness();
}

function updateCompleteness() {
  const ratio = CoverState.completeness();
  const percent = Math.round(ratio * 100);

  const fill = document.querySelector('.draft__progress-fill');
  const text = document.querySelector('.draft__progress-text');
  if (fill) fill.style.width = `${percent}%`;
  if (text) text.textContent = `${percent}% complete`;

  const downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) downloadBtn.disabled = ratio === 0;
}
