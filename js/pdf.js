const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

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
  const filename = buildFilename();

  const options = {
    margin: 0,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 3, backgroundColor: '#ffffff', useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };

  try {
    const worker = html2pdf().set(options).from(node);

    // Force the capture step to finish, then grab the exact canvas it made.
    await worker.toCanvas();
    const canvas = await worker.get('canvas');
    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // Grab the underlying jsPDF instance instead of letting html2pdf place
    // the image on it automatically.
    const pdf = await worker.toPdf().get('pdf');

    // Swap in a page we control completely, sized to exactly one A4 sheet,
    // and stretch the image to cover it fully — no gaps, no guessing.
    pdf.addPage('a4', 'portrait');
    pdf.deletePage(1);
    pdf.setPage(1);
    pdf.addImage(imgData, 'JPEG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM, undefined, 'FAST');

    pdf.save(filename);
  } catch (err) {
    console.error('PDF export failed:', err);
    alert('Something went wrong creating the PDF. Please try again.');
  } finally {
    btn.textContent = original;
    btn.disabled = CoverState.completeness() === 0;
  }
}