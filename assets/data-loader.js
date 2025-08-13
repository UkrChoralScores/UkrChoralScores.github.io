
async function fetchJSON(path){
  const res = await fetch(path);
  if(!res.ok) throw new Error('Failed to load '+path);
  return res.json();
}

function scoreCardHTML(s){
  return `<article class="score-card">
    <img src="${s.preview || 'https://via.placeholder.com/360x240.png?text=Score'}" alt="${s.title || 'Партитура'}">
    <div class="card-body">
      <h3>${s.title || 'Без назви'}</h3>
      <p class="meta">${s.voices || ''} ${s.pages ? '• '+s.pages+' стор.' : ''}</p>
      <div class="card-actions">
        ${s.pdf ? `<a class="btn-sm btn-outline" href="#" data-pdf="${s.pdf}">Переглянути</a>`:''}
        ${s.pdf ? `<a class="btn-sm btn-outline" href="${s.pdf}" download>Завантажити</a>`:''}
      </div>
    </div>
  </article>`;
}

function pairHTML(p){
  const side = (v)=>`<div class="pair-item">
    <img src="${v.preview || 'https://via.placeholder.com/480x640.png?text=Score'}" alt="${v.title || ''}">
    <div class="pair-actions">
      ${v.pdf ? `<a class="btn-sm btn-outline" href="#" data-pdf="${v.pdf}">Переглянути</a>`:''}
      ${v.pdf ? `<a class="btn-sm btn-outline" href="${v.pdf}" download>Завантажити</a>`:''}
    </div>
  </div>`;
  return `<article class="pair card">
    <h3>${p.name}</h3>
    <div class="pair-row">
      ${side(p.old)}${side(p.new)}
    </div>
  </article>`;
}

function authorItemHTML(a){
  const href = `composer.html?slug=${encodeURIComponent(a.slug)}`;
  return `<li class="author-item">
    <div><strong>${a.name}</strong><p class="meta">${a.summary||''}</p></div>
    <a class="btn-sm btn-outline" href="${href}">Детальніше</a>
  </li>`;
}

function productCardHTML(p){
  return `<article class="card product">
    <img src="${p.image || 'https://via.placeholder.com/360x240.png?text=Premium+Score'}" alt="${p.title || ''}">
    <h3>${p.title || ''}</h3>
    <p class="meta">${p.format || ''}</p>
    <div class="card-actions">
      <a class="btn-sm btn-outline" href="${p.file || '#'}">${p.price ? 'Купити — '+p.price+' ₴' : 'Переглянути'}</a>
    </div>
  </article>`;
}

document.addEventListener('DOMContentLoaded', async ()=>{
  // Recent scores on index (combine folk + spiritual first few)
  const recentTarget = document.querySelector('[data-loader="recent-scores"]');
  if(recentTarget){
    try{
      const [folk, spirit] = await Promise.all([
        fetchJSON('content/scores/folk.json'),
        fetchJSON('content/scores/spiritual.json')
      ]);
      const items = [
        ...(folk.pairs||[]).flatMap(p=>[p.old,p.new]),
        ...(spirit.scores||[])
      ].slice(0,10);
      recentTarget.innerHTML = items.map(scoreCardHTML).join('');
    }catch(e){ recentTarget.innerHTML = '<p class="meta">Не вдалося завантажити партитури.</p>'; }
  }
  // News
  const newsTarget = document.querySelector('[data-loader="news"]');
  if(newsTarget){
    try{
      const newsIndex = await fetchJSON('content/news/index.json');
      newsTarget.innerHTML = newsIndex.items.map(n=>`<article class="news card">
        <h3>${n.title}</h3>
        <p class="meta">${n.date}${n.location ? ' • '+n.location : ''}</p>
        <p>${n.excerpt||''}</p>
        <a class="link-more" href="${n.path}">Детальніше →</a>
      </article>`).join('');
    }catch(e){ newsTarget.innerHTML = '<p class="meta">Не вдалося завантажити новини.</p>'; }
  }
  // Folk pairs
  const pairsTarget = document.querySelector('[data-loader="folk-pairs"]');
  if(pairsTarget){
    try{
      const folk = await fetchJSON('content/scores/folk.json');
      pairsTarget.innerHTML = (folk.pairs||[]).map(pairHTML).join('');
    }catch(e){ pairsTarget.innerHTML = '<p class="meta">Не вдалося завантажити народні пісні.</p>'; }
  }
  // Authors
  const authorsTarget = document.querySelector('[data-loader="authors"]');
  if(authorsTarget){
    try{
      const data = await fetchJSON('content/composers/index.json');
      authorsTarget.innerHTML = (data.composers||[]).map(authorItemHTML).join('');
    }catch(e){ authorsTarget.innerHTML = '<li class="meta">Не вдалося завантажити авторів.</li>'; }
  }
  // Composer page
  const params = new URLSearchParams(location.search);
  const slug = params.get('slug');
  if(slug){
    const hero = document.querySelector('[data-loader="composer-hero"]');
    const list = document.querySelector('[data-loader="composer-scores"]');
    const video = document.querySelector('[data-loader="composer-video"]');
    try{
      const comp = await fetchJSON(`content/composers/${slug}.json`);
      if(hero){
        hero.innerHTML = `<img class="composer-photo" src="${comp.photo || 'https://via.placeholder.com/220.png?text=Photo'}" alt="Фото композитора">
          <div><h1>${comp.name}</h1><p class="muted">${comp.bio || ''}</p>
          <div class="composer-actions"><a class="btn-sm btn-outline" href="authors.html">До списку авторів</a></div></div>`;
      }
      if(list){
        const scores = (comp.scores||[]).map(s=>{
          // if has old/new editions horizontally
          if(s.old && s.new){
            return `<article class="pair card"><h3>${s.title||''}</h3><div class="pair-row">
              <div class="pair-item"><img src="${s.old.preview||''}" alt=""><div class="pair-actions">
                ${s.old.pdf?`<a class="btn-sm btn-outline" href="#" data-pdf="${s.old.pdf}">Переглянути</a>`:''}
                ${s.old.pdf?`<a class="btn-sm btn-outline" href="${s.old.pdf}" download>Завантажити</a>`:''}
              </div></div>
              <div class="pair-item"><img src="${s.new.preview||''}" alt=""><div class="pair-actions">
                ${s.new.pdf?`<a class="btn-sm btn-outline" href="#" data-pdf="${s.new.pdf}">Переглянути</a>`:''}
                ${s.new.pdf?`<a class="btn-sm btn-outline" href="${s.new.pdf}" download>Завантажити</a>`:''}
              </div></div>
            </div></article>`;
          }
          return scoreCardHTML(s);
        }).join('');
        list.innerHTML = scores;
      }
      if(video && comp.youtube){
        video.innerHTML = `<iframe src="${comp.youtube}" allowfullscreen title="YouTube приклад"></iframe>`;
      }
    }catch(e){
      if(hero) hero.innerHTML = '<p class="meta">Композитор не знайдений.</p>';
    }
  }
  // Spiritual
  const spiTarget = document.querySelector('[data-loader="spiritual"]');
  if(spiTarget){
    try{
      const data = await fetchJSON('content/scores/spiritual.json');
      spiTarget.innerHTML = (data.scores||[]).map(scoreCardHTML).join('');
    }catch(e){ spiTarget.innerHTML = '<p class="meta">Не вдалося завантажити духовні твори.</p>'; }
  }
  // Shop
  const shopTarget = document.querySelector('[data-loader="shop"]');
  if(shopTarget){
    try{
      const data = await fetchJSON('content/shop/products.json');
      shopTarget.innerHTML = (data.products||[]).map(productCardHTML).join('');
    }catch(e){ shopTarget.innerHTML = '<p class="meta">Не вдалося завантажити товари.</p>'; }
  }
});
