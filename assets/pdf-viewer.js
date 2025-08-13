
window.PDF_VIEWER = (function(){
  let pdfDoc = null, pageNum = 1, scale = 1.1, rendering = false, pagePending = null;
  const modal = document.getElementById('pdf-modal');
  const canvas = document.getElementById('pdf-canvas');
  const ctx = canvas.getContext('2d');
  const pageNumEl = document.getElementById('page-num');
  const pageCountEl = document.getElementById('page-count');
  const downloadLink = document.getElementById('download-link');

  function renderPage(num){
    rendering = true;
    pdfDoc.getPage(num).then(page=>{
      const viewport = page.getViewport({scale});
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const renderContext = {canvasContext: ctx, viewport: viewport};
      const renderTask = page.render(renderContext);
      return renderTask.promise;
    }).then(()=>{
      rendering = false;
      pageNumEl.textContent = num;
      if(pagePending !== null){ renderPage(pagePending); pagePending = null; }
    });
  }
  function queueRenderPage(num){
    if(rendering) pagePending = num;
    else renderPage(num);
  }
  function show(){
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function hide(){
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    canvas.width = 0; canvas.height = 0;
    pdfDoc = null;
  }
  function open(url){
    show();
    downloadLink.href = url;
    const loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then((pdf)=>{
      pdfDoc = pdf;
      pageCountEl.textContent = pdfDoc.numPages;
      pageNum = 1; scale = 1.1;
      renderPage(pageNum);
    }).catch(()=>{ hide(); alert('Не вдалося відкрити PDF.'); });
  }
  // toolbar
  document.addEventListener('click', e=>{
    const a = e.target.closest('[data-action]');
    if(!a) return;
    if(a.dataset.action === 'prev' && pdfDoc && pageNum > 1){ pageNum--; queueRenderPage(pageNum); }
    if(a.dataset.action === 'next' && pdfDoc && pageNum < pdfDoc.numPages){ pageNum++; queueRenderPage(pageNum); }
    if(a.dataset.action === 'zoom-in' && pdfDoc){ scale = Math.min(3, scale + 0.15); queueRenderPage(pageNum); }
    if(a.dataset.action === 'zoom-out' && pdfDoc){ scale = Math.max(.6, scale - 0.15); queueRenderPage(pageNum); }
  });
  document.addEventListener('click', e=>{
    if(e.target.closest('.modal-close') || e.target === modal){ hide(); }
  });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') hide(); });

  return { open };
})();
