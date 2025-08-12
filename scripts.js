// Прості скрипти для каруселі та базових взаємодій
(function(){
  // carousel
  const track = document.getElementById('carousel-track');
  if(track){
    const prev = document.querySelector('.carousel-btn.prev');
    const next = document.querySelector('.carousel-btn.next');
    let index = 0;
    const update = ()=>{
      const cardWidth = track.querySelector('.card')?.offsetWidth || 280;
      const gap = 18;
      const visible = Math.floor((track.parentElement.offsetWidth) / (cardWidth + gap));
      const maxIndex = Math.max(0, track.children.length - visible);
      index = Math.max(0, Math.min(index, maxIndex));
      const x = index * (cardWidth + gap);
      track.style.transform = `translateX(-${x}px)`;
    };
    prev?.addEventListener('click', ()=>{ index--; update(); });
    next?.addEventListener('click', ()=>{ index++; update(); });
    window.addEventListener('resize', update);
    setTimeout(update,200);
  }

  // додаткові дрібниці: плавний скрол
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const href = a.getAttribute('href');
      if(href.length>1){
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({behavior:'smooth'});
      }
    })
  })
})();
