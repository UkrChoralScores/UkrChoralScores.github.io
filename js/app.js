// Simple nav behaviors, burger menu, dropdown and scroll reveal
const dropdown = document.querySelector('.dropdown');
const dropBtn = document.querySelector('.drop-btn');
dropBtn?.addEventListener('click', () => dropdown.classList.toggle('open'));

const burger = document.querySelector('.burger');
const mainNav = document.querySelector('.main-nav');
burger?.addEventListener('click', () => {
  mainNav?.classList.toggle('mobile');
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

// Кнопки партитур
  const slider = document.querySelector('.scores-slider');
  const btnPrev = document.querySelector('.slider-btn.prev');
  const btnNext = document.querySelector('.slider-btn.next');

  btnNext.addEventListener('click', () => {
    slider.scrollBy({ left: 300, behavior: 'smooth' });
  });
  btnPrev.addEventListener('click', () => {
    slider.scrollBy({ left: -300, behavior: 'smooth' });
  });

const scores12 = document.querySelector(".scores12");
const nextBtn12 = document.getElementById("next12");
const prevBtn12 = document.getElementById("prev12");

let scrollAmount12 = 0;
const cardWidth12 = 236; // ширина картки + gap

nextBtn12.addEventListener("click", () => {
  scrollAmount12 -= cardWidth12;
  scores12.style.transform = `translateX(${scrollAmount12}px)`;
});

prevBtn12.addEventListener("click", () => {
  scrollAmount12 += cardWidth12;
  if (scrollAmount12 > 0) scrollAmount12 = 0;
  scores12.style.transform = `translateX(${scrollAmount12}px)`;
});

// Вибираємо всі кнопки "Переглянути"
const viewButtons = document.querySelectorAll('.btn.view-btn');

// Вибираємо модальне вікно та iframe
const modal = document.getElementById('modal1');
const iframe = document.getElementById('modal1-iframe');
const closeBtn = document.querySelector('.close1-btn');

viewButtons.forEach(button => {
  button.addEventListener('click', function(e) {
    e.preventDefault();
    
    const pdfUrl = button.dataset.pdfUrl; // беремо URL з кнопки
    if(!pdfUrl) return;
    
    iframe.src = pdfUrl;         // вставляємо URL у iframe
    modal.classList.remove('hidden'); // показуємо модалку
  });
});

// Закриття модалки
closeBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
  iframe.src = ''; // очищаємо iframe
});

// Закриття при натисканні на фон модалки
modal.addEventListener('click', (e) => {
  if(e.target === modal){
    modal.classList.add('hidden');
    iframe.src = '';
  }
});
