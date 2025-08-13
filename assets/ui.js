
// Intersection reveal
const onVisible = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('visible'); onVisible.unobserve(e.target); }
  });
},{threshold:0.12});
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('.reveal, .card, .score-card, .author-item, .product, .pair').forEach(el=>onVisible.observe(el));
});
