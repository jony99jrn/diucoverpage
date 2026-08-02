// Exports the .document element as a print-ready PDF using html2pdf.js
// (loaded via CDN in index.html — no build step, no bundler).

function buildFilename() {
  const id = CoverState.get('studentId').replace(/[^a-z0-9-]/gi, '');
  const code = CoverState.get('courseCode').replace(/[^a-z0-9-]/gi, '');
  const parts = ['DIU-Cover-Page', code, id].filter(Boolean);
  return `${parts.join('_')}.pdf`;
}

async function downloadCoverPagePdf() {
  const btn = document.getElementById('downloadBtn');
  const original = btn.textContent;
  btn.textContent = 'Preparing PDF…';
  btn.disabled = true;

  const node = document.querySelector('.document');

  const options = {
    margin: 0,
    filename: buildFilename(),
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, backgroundColor: '#ffffff', useCORS: true },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
  };

  try {
    await html2pdf().set(options).from(node).save();
  } catch (err) {
    console.error('PDF export failed:', err);
    alert('Something went wrong creating the PDF. Please try again.');
  } finally {
    btn.textContent = original;
    btn.disabled = CoverState.completeness() === 0;
  }
}
