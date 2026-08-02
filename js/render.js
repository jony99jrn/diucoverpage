// Builds the draft form and the document preview from FIELD_GROUPS,
// then keeps the preview in sync with whatever the state holds.

const ICON_CACHE = {};

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
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const monthIndex = parseInt(m, 10) - 1;
  if (Number.isNaN(monthIndex) || !months[monthIndex]) return isoDate;
  return `${d} ${months[monthIndex]} ${y}`;
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
  for (const group of FIELD_GROUPS) {
    const block = document.createElement('div');
    block.className = 'document__group';

    const title = document.createElement('div');
    title.className = 'document__group-title';
    title.textContent = group.docTitle;
    block.appendChild(title);

    for (const field of group.fields) {
      const row = document.createElement('div');
      row.className = 'doc-row';
      row.dataset.field = field.id;

      const label = document.createElement('span');
      label.className = 'doc-row__label';
      label.textContent = field.label;

      const leader = document.createElement('span');
      leader.className = 'doc-row__leader';

      const value = document.createElement('span');
      value.className = 'doc-row__value';

      row.appendChild(label);
      row.appendChild(leader);
      row.appendChild(value);
      block.appendChild(row);
    }

    root.appendChild(block);
  }
}

function updatePreview() {
  document.querySelectorAll('.doc-row').forEach((row) => {
    const fieldId = row.dataset.field;
    const isDate = fieldId === 'submissionDate';
    const raw = CoverState.get(fieldId);
    const valueEl = row.querySelector('.doc-row__value');
    const display = isDate ? formatDateForDoc(raw) : raw;

    if (display) {
      valueEl.textContent = display;
      valueEl.classList.remove('is-empty');
    } else {
      const group = FIELD_GROUPS.find((g) => g.fields.some((f) => f.id === fieldId));
      const field = group.fields.find((f) => f.id === fieldId);
      valueEl.textContent = field.placeholder ? field.placeholder : '—';
      valueEl.classList.add('is-empty');
    }
  });

  updateCompleteness();
}

function updateCompleteness() {
  const ratio = CoverState.completeness();
  const percent = Math.round(ratio * 100);

  const fill = document.querySelector('.draft__progress-fill');
  const text = document.querySelector('.draft__progress-text');
  if (fill) fill.style.width = `${percent}%`;
  if (text) text.textContent = `${percent}% complete`;

  const seal = document.querySelector('.document__seal');
  const ring = document.querySelector('.document__seal-ring circle');
  if (seal) seal.classList.toggle('is-complete', ratio === 1);
  if (ring) {
    const circumference = 2 * Math.PI * 44;
    ring.style.strokeDasharray = `${circumference}`;
    ring.style.strokeDashoffset = `${circumference * (1 - ratio)}`;
  }

  const downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) downloadBtn.disabled = ratio === 0;
}
