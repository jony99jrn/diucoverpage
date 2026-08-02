document.addEventListener('DOMContentLoaded', async () => {
  CoverState.load();

  const formRoot = document.getElementById('formRoot');
  const previewRoot = document.getElementById('previewRoot');

  buildPreviewRows(previewRoot);
  await buildForm(formRoot);
  updatePreview();

  const downloadBtn = document.getElementById('downloadBtn');
  downloadBtn.addEventListener('click', downloadCoverPagePdf);

  // Mobile Edit/Preview toggle — panes are always both rendered,
  // this just controls which one is visible below the breakpoint.
  const toggleButtons = document.querySelectorAll('.view-toggle button');
  toggleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      toggleButtons.forEach((b) => b.classList.toggle('is-active', b === btn));
      document.querySelectorAll('.pane').forEach((pane) => {
        pane.classList.toggle('is-visible', pane.dataset.pane === target);
      });
    });
  });
});
