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

  // Keyboard support for carousel
  document.querySelectorAll('.carousel').forEach(car=>{
    car.addEventListener('keydown', e=>{
      if(e.key === 'ArrowLeft') car.scrollBy({left:-300,behavior:'smooth'});
      if(e.key === 'ArrowRight') car.scrollBy({left:300,behavior:'smooth'});
    });
  });

  // Delegated click: open PDF via pdf.js viewer
  document.addEventListener('click', e=>{
    const t = e.target.closest('[data-pdf]');
    if(t){
      e.preventDefault();
      const url = t.getAttribute('data-pdf');
      if(window.PDF_VIEWER && url) window.PDF_VIEWER.open(url);
    }
  });
})();