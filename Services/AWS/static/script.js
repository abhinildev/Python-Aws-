/* final script.js
   Works specifically with the index.html you pasted.
   - Uses public images as fallback so hero & cards always display.
   - Defensive: checks for elements before using them and logs.
*/

const PLACES = [
  { id: 'bali', title: 'Bali Tour Package', desc: '23 AUGUST - 29 AUGUST · Bali Tour Package', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=80' },
  { id: 'java', title: 'Java Tour Package', desc: '23 AUGUST - 27 AUGUST · Java Tour Package', img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1400&q=80' },
  { id: 'solo', title: 'Solo Tour Package', desc: '23 AUGUST - 25 AUGUST · Solo Tour Package', img: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1400&q=80' }
];
const HERO_IMG = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=2000&q=80';

/* helper selectors */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

/* ---------- on DOM ready ---------- */
document.addEventListener('DOMContentLoaded', () => {
  console.log('[script] DOM loaded');

  ensureHeroImage();
  renderPlaces();
  setupUI();
  initStaggerVisualizer();
});

/* ---------- ensure hero image shows (fallback) ---------- */
function ensureHeroImage(){
  const heroImg = document.querySelector('.hero-bg img');
  if(!heroImg){
    console.warn('[script] .hero-bg img not found — hero will be blank unless you add assets/hero.jpg');
    return;
  }
  // if src empty or broken, set fallback public image
  const src = heroImg.getAttribute('src') || '';
  if(!src.trim()){
    heroImg.src = HERO_IMG;
  }
  heroImg.onerror = () => { heroImg.src = HERO_IMG; };
}

/* ---------- render place cards into #places ---------- */
function renderPlaces(){
  const root = $('#places');
  if(!root){
    console.error('[script] #places element not found — cannot render tour cards');
    return;
  }
  root.innerHTML = ''; // clear

  PLACES.forEach(p => {
    const art = document.createElement('article');
    art.className = 'place';
    art.dataset.id = p.id;
    art.innerHTML = `
      <div class="badge">7 Days</div>
      <img src="${p.img}" alt="${p.title}" loading="lazy" onerror="this.src='${HERO_IMG}'" />
      <div class="meta">
        <h3>${p.title}</h3>
        <p class="muted">${p.desc}</p>
      </div>
    `;
    art.addEventListener('click', () => openDetail(p));
    root.appendChild(art);
  });

  console.log('[script] rendered', PLACES.length, 'places');
}

/* ---------- setup UI handlers ---------- */
function setupUI(){
  const frost = $('#frostOverlay');

  // login
  const loginBtn = $('#loginBtn');
  const loginPanel = $('#loginPanel');
  const closeLogin = $('#closeLogin');

  if(loginBtn && loginPanel){
    loginBtn.addEventListener('click', () => {
      loginPanel.classList.add('active');
      if(frost) frost.classList.add('active');
    });
  } else {
    console.warn('[script] login button or panel not found (#loginBtn, #loginPanel)');
  }
  if(closeLogin){
    closeLogin.addEventListener('click', () => {
      if(loginPanel) loginPanel.classList.remove('active');
      if(frost) frost.classList.remove('active');
    });
  }

  // quick search
  const quickSearch = $('#quickSearch');
  if(quickSearch){
    quickSearch.addEventListener('click', () => {
      // simple demo: open first matching place, otherwise first
      const budget = ($('#searchBudget') ? $('#searchBudget').value : '').toLowerCase();
      const found = PLACES.find(x => x.title.toLowerCase().includes(budget) || x.desc.toLowerCase().includes(budget));
      if(found) openDetail(found);
      else if(PLACES.length) openDetail(PLACES[0]);
    });
  }

  // modal close & booking
  const closeModal = $('#closeModal');
  const bookNow = $('#bookNow');
  if(closeModal) closeModal.addEventListener('click', closeDetailModal);
  if(bookNow) bookNow.addEventListener('click', () => {
    const from = $('#modalFrom') ? $('#modalFrom').value : '';
    const to = $('#modalTo') ? $('#modalTo').value : '';
    const guests = $('#modalGuests') ? $('#modalGuests').value : '';
    if(!from || !to){
      alert('Please select both From and To dates');
      return;
    }
    const title = $('#modalTitle') ? $('#modalTitle').textContent : 'Package';
    alert(`Booking confirmed for ${title}\nFrom: ${from}\nTo: ${to}\nGuests: ${guests}`);
    closeDetailModal();
  });

  // clicking the frost overlay closes open panels
  if(frost){
    frost.addEventListener('click', () => {
      if(loginPanel) loginPanel.classList.remove('active');
      closeDetailModal();
      frost.classList.remove('active');
    });
  }

  // escape key closes
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape'){
      if(loginPanel) loginPanel.classList.remove('active');
      closeDetailModal();
      if(frost) frost.classList.remove('active');
    }
  });

  console.log('[script] UI handlers attached');
}

/* ---------- open / close detail modal ---------- */
function openDetail(place){
  const modal = $('#detailModal');
  if(!modal){
    console.error('[script] #detailModal not found');
    return;
  }

  const img = $('#modalImg');
  const title = $('#modalTitle');
  const desc = $('#modalDesc');

  if(img) { img.src = place.img; img.onerror = () => img.src = HERO_IMG; }
  if(title) title.textContent = place.title || 'Package';
  if(desc) desc.textContent = place.desc || '';

  // default dates
  const today = new Date();
  const d1 = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
  const d2 = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10);
  if($('#modalFrom')) $('#modalFrom').value = d1.toISOString().slice(0,10);
  if($('#modalTo')) $('#modalTo').value = d2.toISOString().slice(0,10);

  modal.classList.add('active');
  const frost = $('#frostOverlay'); if(frost) frost.classList.add('active');

  // animate in if anime is present
  if(window.anime){
    anime({
      targets: '.detail-content',
      translateY: [-20, 0],
      opacity: [0, 1],
      duration: 420,
      easing: 'easeOutExpo'
    });
  }
}

function closeDetailModal(){
  const modal = $('#detailModal');
  if(!modal) return;
  modal.classList.remove('active');
  const frost = $('#frostOverlay'); if(frost) frost.classList.remove('active');
}

/* ---------- anime.js stagger visualizer ---------- */
function fitElementToParent(el, padding){
  let timeout = null;
  function resize(){
    if(timeout) clearTimeout(timeout);
    if(!el) return;
    anime.set(el, { scale: 1 });
    const pad = padding || 0;
    const parentEl = el.parentNode;
    if(!parentEl) return;
    const elOffsetWidth = el.offsetWidth - pad;
    const parentOffsetWidth = parentEl.offsetWidth;
    const ratio = parentOffsetWidth / elOffsetWidth;
    timeout = setTimeout(() => anime.set(el, { scale: ratio }), 10);
  }
  resize();
  window.addEventListener('resize', resize);
}

function initStaggerVisualizer(){
  const viz = document.querySelector('.stagger-visualizer');
  if(!viz){
    console.warn('[script] .stagger-visualizer not found (visualizer disabled)');
    return;
  }
  if(!window.anime){
    console.warn('[script] anime.js not loaded (visualizer disabled)');
    return;
  }
  const dotsWrapper = viz.querySelector('.dots-wrapper');
  const grid = [20,10];
  const cell = 55;
  const numberOfElements = grid[0] * grid[1];
  fitElementToParent(viz, 0);

  // build dots
  const frag = document.createDocumentFragment();
  for(let i=0;i<numberOfElements;i++){
    const d = document.createElement('div'); d.className = 'dot'; frag.appendChild(d);
  }
  dotsWrapper.appendChild(frag);

  let index = anime.random(0, numberOfElements-1);

  anime.set('.stagger-visualizer .cursor', {
    translateX: anime.stagger(-cell, { grid, from: index, axis: 'x' }),
    translateY: anime.stagger(-cell, { grid, from: index, axis: 'y' }),
    scale: 1.3
  });

  function play(){
    const nextIndex = anime.random(0, numberOfElements-1);
    const animation = anime.timeline({ easing:'easeInOutQuad', complete: play })
      .add({
        targets: '.stagger-visualizer .cursor',
        keyframes: [{ scale: .75, duration:120 }, { scale: 2.5, duration:220 }, { scale: 1.3, duration: 450 }]
      })
      .add({
        targets: '.stagger-visualizer .dot',
        keyframes: [
          { translateX: anime.stagger('-2px', { grid, from: index, axis: 'x' }), translateY: anime.stagger('-2px', { grid, from: index, axis: 'y' }), duration: 100 },
          { translateX: anime.stagger('4px', { grid, from: index, axis: 'x' }), translateY: anime.stagger('4px', { grid, from: index, axis: 'y' }), scale: anime.stagger([2.6,1], { grid, from: index }), duration: 225 },
          { translateX: 0, translateY: 0, scale: 1, duration: 1200 }
        ],
        delay: anime.stagger(60, { grid, from: index })
      }, 30)
      .add({
        targets: '.stagger-visualizer .cursor',
        translateX: { value: anime.stagger(-cell, { grid, from: nextIndex, axis: 'x' }) },
        translateY: { value: anime.stagger(-cell, { grid, from: nextIndex, axis: 'y' }) },
        scale: 1.3,
        easing: 'cubicBezier(.075, .2, .165, 1)'
      }, '-=800');
    index = nextIndex;
  }

  play();
}
