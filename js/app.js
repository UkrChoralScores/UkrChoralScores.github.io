// Simple nav behaviors, burger menu, dropdown and scroll reveal
const dropdown = document.querySelector('.dropdown');
const dropBtn = document.querySelector('.drop-btn');
dropBtn?.addEventListener('click', () => dropdown.classList.toggle('open'));

const burger = document.querySelector('.burger');
const mainNav = document.querySelector('.main-nav');
burger?.addEventListener('click', () => {
  if(!mainNav) return;
  mainNav.style.display = mainNav.style.display === 'flex' ? 'none' : 'flex';
  mainNav.style.flexDirection = 'column';
  mainNav.style.gap = '10px';
});

// Scroll reveal for elements with .scroll-reveal children
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll(':scope > *').forEach(el=>el.style.opacity=1);
      e.target.classList.add('revealed');
      observer.unobserve(e.target);
    }
  })
},{threshold:.15});
document.querySelectorAll('.scroll-reveal').forEach(el=>observer.observe(el));

// Fake live search (client-side filter on cards by title text)
function enableLocalSearch(containerSelector, inputSelector){
  const container = document.querySelector(containerSelector);
  const input = document.querySelector(inputSelector) || document.querySelector('.filter-input');
  if(!container || !input) return;
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    container.querySelectorAll('.card, .product, .news-card').forEach(card=>{
      const t = card.textContent.toLowerCase();
      card.style.display = t.includes(q) ? '' : 'none';
    });
  });
}
enableLocalSearch('.grid-3,.grid-4', '.search input');