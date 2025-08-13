
async function fetchJSON(path){
  const res = await fetch(path);
  if(!res.ok) throw new Error('Failed to load '+path);
  return res.json();
}
const html = String.raw;

function scoreCardHTML(s){
  return html`<article class="score-card reveal">
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
  const side = (v)=>html`<div class="pair-item reveal">
    <img src="${v.preview || 'https://via.placeholder.com/480x640.png?text=Score'}" alt="${v.title || ''}">
    <div class="pair-actions">
      ${v.pdf ? `<a class="btn-sm btn-outline" href="#" data-pdf="${v.pdf}">Переглянути</a>`:''}
      ${v.pdf ? `<a class="btn-sm btn-outline" href="${v.pdf}" download>Завантажити</a>`:''}
    </div>
  </div>`;
  return html`<article class="pair card">
    <h3>${p.name}</h3>
    <div class="pair-row">
      ${side(p.old)}${side(p.new)}
    </div>
  </article>`;
}

function authorItemHTML(a){
  const href = `composer.html?slug=${encodeURIComponent(a.slug)}`;
  return html`<li class="author-item reveal">
    <div><strong>${a.name}</strong><p class="meta">${a.summary||''}</p></div>
    <a class="btn-sm btn-outline" href="${href}">Детальніше</a>
  </li>`;
}

function productCardHTML(p){
  return html`<article class="card product reveal">
    <img src="${p.image || 'https://via.placeholder.com/360x240.png?text=Premium+Score'}" alt="${p.title || ''}">
    <h3>${p.title || ''}</h3>
    <p class="meta">${p.format || ''}</p>
    <div class="card-actions">
      <a class="btn-sm btn-outline" href="${p.file || '#'}">${p.price ? 'Купити — '+p.price+' ₴' : 'Переглянути'}</a>
    </div>
  </article>`;
}

// Simple search index builder
async function buildIndex(){
  const [folk, spirit, comps, news, shop] = await Promise.all([
    fetchJSON('content/scores/folk.json').catch(()=>({pairs:[]})),
    fetchJSON('content/scores/spiritual.json').catch(()=>({scores:[]})),
    fetchJSON('content/composers/index.json').catch(()=>({composers:[]})),
    fetchJSON('content/news/index.json').catch(()=>({items:[]})),
    fetchJSON('content/shop/products.json').catch(()=>({products:[]})),
  ]);

  const scores = [];
  (folk.pairs||[]).forEach(p=>{
    if(p.old) scores.push({type:'score', title:`${p.name} — стара редакція`, url:p.old.pdf||'#', preview:p.old.preview, voices:p.old.voices});
    if(p.new) scores.push({type:'score', title:`${p.name} — нова редакція`, url:p.new.pdf||'#', preview:p.new.preview, voices:p.new.voices});
  });
  (spirit.scores||[]).forEach(s=>scores.push({type:'score', title:s.title, url:s.pdf||'#', preview:s.preview, voices:s.voices}));

  const composers = (comps.composers||[]).map(c=>({type:'composer', title:c.name, url:`composer.html?slug=${encodeURIComponent(c.slug)}`, preview:c.photo}));
  const newsItems = (news.items||[]).map(n=>({type:'news', title:n.title, url:n.path}));
  const products = (shop.products||[]).map(p=>({type:'product', title:p.title, url:p.file||'#'}));

  return {scores, composers, news: newsItems, products};
}

function renderResults(results, scope='all'){
  const container = document.getElementById('search-results');
  if(!container) return;
  let filtered = [];
  if(scope==='scores') filtered = results.scores;
  else if(scope==='composers') filtered = results.composers;
  else if(scope==='news') filtered = results.news;
  else filtered = [...results.scores, ...results.composers, ...results.news];

  container.innerHTML = filtered.map(r=>{
    if(r.type==='score'){
      return html`<article class="result-card">
        <img src="${r.preview || 'https://via.placeholder.com/360x240.png?text=Score'}" alt="">
        <h3>${r.title}</h3>
        <div class="card-actions">
          <a class="btn-sm btn-outline" href="#" data-pdf="${r.url}">Переглянути</a>
          <a class="btn-sm btn-outline" href="${r.url}" download>Завантажити</a>
        </div>
      </article>`;
    }
    return html`<article class="result-card">
      <h3>${r.title}</h3>
      <a class="btn-sm btn-outline" href="${r.url}">Відкрити</a>
    </article>`;
  }).join('');
}

document.addEventListener('DOMContentLoaded', async ()=>{
  // Recent scores on index
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
      ].filter(Boolean).slice(0,12);
      recentTarget.innerHTML = items.map(scoreCardHTML).join('');
    }catch(e){ recentTarget.innerHTML = '<p class="meta">Не вдалося завантажити партитури.</p>'; }
  }
  // News
  const newsTarget = document.querySelector('[data-loader="news"]');
  if(newsTarget){
    try{
      const newsIndex = await fetchJSON('content/news/index.json');
      newsTarget.innerHTML = newsIndex.items.map(n=>html`<article class="news card reveal">
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
        hero.innerHTML = html`<img class="composer-photo" src="${comp.photo || 'https://via.placeholder.com/220.png?text=Photo'}" alt="Фото композитора">
          <div><h1>${comp.name}</h1><p class="muted">${comp.bio || ''}</p>
          <div class="composer-actions"><a class="btn-sm btn-outline" href="authors.html">До списку авторів</a></div></div>`;
      }
      if(list){
        const scores = (comp.scores||[]).map(s=>{
          if(s.old && s.new){
            return html`<article class="pair card">
              <h3>${s.title||''}</h3>
              <div class="pair-row">
                <div class="pair-item"><img src="${s.old.preview||''}" alt=""><div class="pair-actions">
                  ${s.old.pdf?`<a class="btn-sm btn-outline" href="#" data-pdf="${s.old.pdf}">Переглянути</a>`:''}
                  ${s.old.pdf?`<a class="btn-sm btn-outline" href="${s.old.pdf}" download>Завантажити</a>`:''}
                </div></div>
                <div class="pair-item"><img src="${s.new.preview||''}" alt=""><div class="pair-actions">
                  ${s.new.pdf?`<a class="btn-sm btn-outline" href="#" data-pdf="${s.new.pdf}">Переглянути</a>`:''}
                  ${s.new.pdf?`<a class="btn-sm btn-outline" href="${s.new.pdf}" download>Завантажити</a>`:''}
                </div></div>
              </div>
            </article>`;
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

  // Search page logic
  if(location.pathname.endsWith('search.html')){
    const q = (new URLSearchParams(location.search)).get('q') || '';
    document.getElementById('query-label').textContent = q ? `Запит: "${q}"` : 'Введіть запит у полі пошуку';

    const idx = await buildIndex();
    const needle = q.trim().toLowerCase();
    function match(s){ return !needle || (s && s.toLowerCase().includes(needle)); }
    const results = {
      scores: idx.scores.filter(r=>match(r.title) || match(r.voices)),
      composers: idx.composers.filter(r=>match(r.title)),
      news: idx.news.filter(r=>match(r.title))
    };
    renderResults(results, 'all');

    // Tabs
    document.querySelectorAll('.tab').forEach(t=>t.addEventListener('click', ()=>{
      document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
      t.classList.add('active');
      renderResults(results, t.dataset.scope);
    }));
  }
});
