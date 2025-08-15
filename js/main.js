
// Search
const searchInput = document.querySelector('#site-search');
if (searchInput){
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    document.querySelectorAll('.score-card,[data-pair-title]').forEach(card => {
      const text = (card.dataset.search || card.dataset.pairTitle || '').toLowerCase();
      card.style.display = text.includes(q) ? '' : 'none';
    });
  });
}

// Setup carousels
function setupCarousel(carousel){
  const track = carousel.querySelector('.track');
  const prev = carousel.querySelector('.prev');
  const next = carousel.querySelector('.next');
  const step = 320;

  function updateButtons(){
    if(!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth - 2;
    prev.disabled = track.scrollLeft <= 0;
    next.disabled = track.scrollLeft >= maxScroll;
  }

  prev?.addEventListener('click', (e) => {
    e.preventDefault();
    track.scrollBy({left: -step, behavior: 'smooth'});
    setTimeout(updateButtons, 350);
  });
  next?.addEventListener('click', (e) => {
    e.preventDefault();
    track.scrollBy({left: step, behavior: 'smooth'});
    setTimeout(updateButtons, 350);
  });

  track?.addEventListener('scroll', updateButtons, {passive:true});
  updateButtons();
}

document.querySelectorAll('.carousel').forEach(setupCarousel);

// Modal PDF viewer
const modal = document.querySelector('#viewer-modal');
const modalFrame = document.querySelector('#viewer-frame');
const modalTitle = document.querySelector('#viewer-title');
document.querySelectorAll('[data-view]').forEach(btn => {
  btn.addEventListener('click', () => {
    const pdf = btn.getAttribute('data-view');
    const title = btn.getAttribute('data-title') || 'Перегляд партитури';
    if(modal && modalFrame){
      modalFrame.src = pdf;
      if(modalTitle) modalTitle.textContent = title;
      modal.classList.add('open');
    } else {
      window.open(pdf, '_blank');
    }
  });
});
document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', () => {
  if(modal){ modal.classList.remove('open'); modalFrame.src = ''; }
}));

// News expand/collapse
document.querySelectorAll('[data-toggle-full]').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-toggle-full');
    const item = document.getElementById(id);
    if(!item) return;
    const expanded = item.classList.toggle('expanded');
    btn.textContent = expanded ? 'Згорнути' : 'Детальніше';
  });
});

// Placeholder Firebase Google Auth (opt-in)
window.initFirebaseAuth = () => {
  if (!window.firebase) return;
  try{
    const app = firebase.initializeApp({
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT.firebaseapp.com",
      projectId: "YOUR_PROJECT_ID",
      appId: "YOUR_APP_ID"
    });
    const provider = new firebase.auth.GoogleAuthProvider();
    const auth = firebase.auth();
    const loginBtn = document.querySelector('#login-btn');
    const logoutBtn = document.querySelector('#logout-btn');
    const userEl = document.querySelector('#user-pill');
    function updateUser(user){
      if (!userEl) return;
      if(user){
        userEl.textContent = user.displayName || user.email;
        userEl.classList.remove('hidden');
        loginBtn?.classList.add('hidden');
        logoutBtn?.classList.remove('hidden');
      } else {
        userEl.classList.add('hidden');
        loginBtn?.classList.remove('hidden');
        logoutBtn?.classList.add('hidden');
      }
    }
    loginBtn?.addEventListener('click', () => auth.signInWithPopup(provider));
    logoutBtn?.addEventListener('click', () => auth.signOut());
    auth.onAuthStateChanged(updateUser);
  }catch(e){
    console.warn('Firebase config not set:', e.message);
  }
};
window.addEventListener('DOMContentLoaded', () => window.initFirebaseAuth?.());
