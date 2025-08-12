// Lightweight JS for carousel controls, mobile menu, modal preview
(function(){
  // Mobile menu toggle
  const menuToggle = document.querySelectorAll('.menu-toggle');
  menuToggle.forEach(btn=>btn.addEventListener('click', ()=>{
    const nav = document.querySelector('.main-nav');
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    if(window.getComputedStyle(nav).display === 'none'){
      nav.style.display = 'flex';
      nav.style.flexDirection = 'column';
      nav.style.gap = '8px';
    } else {
      nav.style.display = '';
    }
  }));

  // Carousel arrow controls scroll
  document.querySelectorAll('.carousel-prev, .carousel-next').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const target = document.querySelector(btn.dataset.target || '#recent-scores');
      if(!target) return;
      const width = target.clientWidth;
      const amount = Math.round(width * 0.7);
      if(btn.classList.contains('carousel-prev')) target.scrollBy({left: -amount, behavior:'smooth'});
      else target.scrollBy({left: amount, behavior:'smooth'});
    });
  });

  // Keyboard support for carousel (left/right)
  document.querySelectorAll('.carousel').forEach(car=>{
    car.addEventListener('keydown', e=>{
      if(e.key === 'ArrowLeft') car.scrollBy({left:-300,behavior:'smooth'});
      if(e.key === 'ArrowRight') car.scrollBy({left:300,behavior:'smooth'});
    });
  });

  // Modal preview (uses iframe src)
  const modal = document.getElementById('preview-modal');
  const frame = document.getElementById('preview-frame');
  function openPreview(src){
    if(!modal || !frame) return;
    frame.src = src;
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closePreview(){
    if(!modal || !frame) return;
    modal.setAttribute('aria-hidden','true');
    frame.src = '';
    document.body.style.overflow = '';
  }
  document.addEventListener('click', e=>{
    const t = e.target;
    if(t.matches('[data-preview-src]')){
      const src = t.dataset.previewSrc;
      openPreview(src);
    }
    if(t.closest('.modal-close') || t === modal) closePreview();
  });
  document.addEventListener('keydown', e=>{ if(e.key === 'Escape') closePreview(); });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const href = a.getAttribute('href');
      if(href.length>1){
        const el = document.querySelector(href);
        if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth'}); }
      }
    });
  });
})();