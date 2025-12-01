/* script.js - final changes
   - frost overlay blurs page when active (covers content)
   - signup panel + login
   - newsletter submit with success text
   - visualizer stays behind content
*/

const PLACES = [
  { id:'bali', title:'Bali Tour Package', desc:'23 AUG - 29 AUG · Bali', img:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=60' },
  { id:'java', title:'Java Tour Package', desc:'23 AUG - 27 AUG · Java', img:'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1400&q=60' },
  { id:'solo', title:'Solo Tour Package', desc:'23 AUG - 25 AUG · Solo', img:'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1400&q=60' }
];

const HERO_FALLBACK = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&q=60';
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setupThemeToggle();
  ensureHeroImage();
  renderPlaces();
  bindUI();
  initStaggerVisualizer();
});

/* THEME */
function initTheme(){
  const saved = localStorage.getItem('wanderly-theme') || 'dark';
  if(saved === 'light') document.documentElement.setAttribute('data-theme','light');
  else document.documentElement.removeAttribute('data-theme');
  const btn = $('#themeToggle'); if(btn) btn.textContent = (saved === 'light') ? 'Dark' : 'Light';
}
function setupThemeToggle(){
  const btn = $('#themeToggle'); if(!btn) return;
  btn.addEventListener('click', ()=>{
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    if(next === 'light') document.documentElement.setAttribute('data-theme','light'); else document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('wanderly-theme', next);
    btn.textContent = (next === 'light') ? 'Dark' : 'Light';
  });
}

/* HERO image fallback */
function ensureHeroImage(){
  const hero = $('#heroImg');
  if(!hero) return;
  if(!hero.getAttribute('src') || hero.getAttribute('src').trim() === '') hero.src = HERO_FALLBACK;
  hero.onerror = () => hero.src = HERO_FALLBACK;
}

/* RENDER PLACES */
function renderPlaces(){
  const root = $('#places'); if(!root) return;
  root.innerHTML = '';
  PLACES.forEach(p => {
    const art = document.createElement('article'); art.className = 'place';
    art.innerHTML = `
      <div class="badge">7 Days</div>
      <img src="${p.img}" alt="${p.title}" loading="lazy" onerror="this.src='${HERO_FALLBACK}'">
      <div class="meta"><h3>${p.title}</h3><p class="muted">${p.desc}</p></div>
    `;
    art.addEventListener('click', ()=> openDetail(p));
    root.appendChild(art);
  });
}

/* UI Bindings */
function bindUI(){
  const frost = $('#frostOverlay');
  const loginBtn = $('#loginBtn');
  const loginPanel = $('#loginPanel');
  const closeLogin = $('#closeLogin');
  const quickSearch = $('#quickSearch');
  const closeModal = $('#closeModal');
  const bookNow = $('#bookNow');

  const signupPanel = $('#signupPanel');
  const openSignup = $('#openSignup');
  const closeSignup = $('#closeSignup');

  if(loginBtn && loginPanel){
    loginBtn.addEventListener('click', ()=> { openPanel(loginPanel); });
  }
  if(closeLogin){
    closeLogin.addEventListener('click', ()=> { closePanel(loginPanel); });
  }

  // sign up from login
  const openSignupBtn = $('#openSignup');
  if(openSignupBtn){
    openSignupBtn.addEventListener('click', ()=> {
      closePanel(loginPanel);
      openPanel(signupPanel);
    });
  }
  if(closeSignup){
    closeSignup.addEventListener('click', ()=> closePanel(signupPanel));
  }
  if($('#signupSubmit')){
    $('#signupSubmit').addEventListener('click', ()=> {
      // simple demo sign-up success
      alert('Account created (demo). You can now login.');
      closePanel(signupPanel);
    });
  }

  // login submit
  if($('#loginSubmit')){
    $('#loginSubmit').addEventListener('click', ()=> {
      alert('Logged in (demo).');
      closePanel(loginPanel);
    });
  }

  // newsletter submit
  const newsletterForm = $('#newsletterForm');
  if(newsletterForm){
    newsletterForm.addEventListener('submit', (e)=> {
      e.preventDefault();
      const email = $('#newsletterEmail') ? $('#newsletterEmail').value.trim() : '';
      const msg = $('#newsletterMsg');
      if(!email || !validateEmail(email)){
        if(msg) { msg.textContent = 'Please enter a valid email.'; msg.style.color = 'tomato'; }
        return;
      }
      // demo success
      if(msg){ msg.textContent = 'Thanks — you are subscribed!'; msg.style.color = ''; }
      newsletterForm.reset();
    });
  }

  // quick search open first place
  if(quickSearch){
    quickSearch.addEventListener('click', ()=> { if(PLACES.length) openDetail(PLACES[0]); });
  }

  if(closeModal) closeModal.addEventListener('click', closeDetailModal);
  if(bookNow){
    bookNow.addEventListener('click', ()=>{
      const title = $('#modalTitle') ? $('#modalTitle').textContent : 'Package';
      const from = $('#modalFrom') ? $('#modalFrom').value : '';
      const to = $('#modalTo') ? $('#modalTo').value : '';
      if(!from || !to){ alert('Please choose dates'); return; }
      alert(`Booked ${title}\nFrom: ${from}\nTo: ${to}`);
      closeDetailModal();
    });
  }

  // clicking frost closes panels + modal
  if(frost){
    frost.addEventListener('click', ()=> {
      closePanel(loginPanel); closePanel(signupPanel); closeDetailModal();
      frost.classList.remove('active');
    });
  }

  // esc closes
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape'){
      closePanel(loginPanel); closePanel(signupPanel); closeDetailModal();
      const f = $('#frostOverlay'); if(f) f.classList.remove('active');
    }
  });
}

/* open/close panels (login/signup) - frost overlay active */
function openPanel(panel){
  if(!panel) return;
  const frost = $('#frostOverlay');
  panel.classList.add('active');
  if(frost) frost.classList.add('active');
}
function closePanel(panel){
  if(!panel) return;
  panel.classList.remove('active');
  // if no other panel/modal active, remove frost (modal close handles its own)
  const anyModal = document.querySelector('#detailModal.active');
  const loginActive = document.querySelector('#loginPanel.active');
  const signupActive = document.querySelector('#signupPanel.active');
  if(!anyModal && !loginActive && !signupActive){
    const frost = $('#frostOverlay'); if(frost) frost.classList.remove('active');
  }
}

/* MODAL */
function openDetail(place){
  const modal = $('#detailModal'); if(!modal) return;
  const img = $('#modalImg'); const title = $('#modalTitle'); const desc = $('#modalDesc');
  if(img){ img.src = place.img; img.onerror = ()=> img.src = HERO_FALLBACK; }
  if(title) title.textContent = place.title || 'Package';
  if(desc) desc.textContent = place.desc || '';

  // default dates
  const now = new Date(); const d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate()+7);
  const d2 = new Date(now.getFullYear(), now.getMonth(), now.getDate()+10);
  if($('#modalFrom')) $('#modalFrom').value = d1.toISOString().slice(0,10);
  if($('#modalTo')) $('#modalTo').value = d2.toISOString().slice(0,10);

  modal.classList.add('active');
  const frost = $('#frostOverlay'); if(frost) frost.classList.add('active');

  // animate in
  const content = modal.querySelector('.detail-content');
  if(content && window.anime){
    anime.set(content, { translateY: 20, opacity: 0 });
    anime({ targets: content, translateY: [20,0], opacity: [0,1], duration: 420, easing: 'easeOutExpo' });
  }
}
function closeDetailModal(){
  const modal = $('#detailModal'); if(!modal) return;
  const content = modal.querySelector('.detail-content');
  if(content && window.anime){
    anime({ targets: content, translateY: [0,10], opacity: [1,0], duration: 220, easing:'easeInQuad', complete: ()=> modal.classList.remove('active') });
  } else { modal.classList.remove('active'); }
  const frost = $('#frostOverlay'); if(frost) {
    // if no other panels are open, remove frost
    setTimeout(()=> {
      const loginActive = document.querySelector('#loginPanel.active');
      const signupActive = document.querySelector('#signupPanel.active');
      if(!loginActive && !signupActive) frost.classList.remove('active');
    }, 60);
  }
}

/* EMAIL validator */
function validateEmail(email){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ANIME.JS STAGGER VISUALIZER */
function fitElementToParent(el, padding){
  let timeout = null;
  function resize(){
    if(timeout) clearTimeout(timeout);
    anime.set(el, { scale: 1 });
    const pad = padding || 0;
    const parent = el.parentNode;
    if(!parent) return;
    const elW = el.offsetWidth - pad;
    const parentW = parent.offsetWidth;
    const ratio = parentW / elW;
    timeout = setTimeout(()=> anime.set(el, { scale: ratio }), 10);
  }
  resize();
  window.addEventListener('resize', resize);
}

function initStaggerVisualizer(){
  const viz = document.querySelector('.stagger-visualizer');
  if(!viz){ console.warn('stagger visualizer missing'); return; }
  if(!window.anime){ console.warn('anime.js not loaded'); return; }
  const dotsWrapper = viz.querySelector('.dots-wrapper');
  if(!dotsWrapper) return;

  const grid = [20,10]; const cell = 55; const numberOfElements = grid[0]*grid[1];
  fitElementToParent(viz, 0);

  if(dotsWrapper.children.length === 0){
    const frag = document.createDocumentFragment();
    for(let i=0;i<numberOfElements;i++){
      const d = document.createElement('div'); d.className = 'dot'; frag.appendChild(d);
    }
    dotsWrapper.appendChild(frag);
  }

  if(!viz.querySelector('.cursor')){
    const c = document.createElement('div'); c.className = 'cursor'; viz.appendChild(c);
  }

  let index = anime.random(0, numberOfElements-1);

  anime.set('.stagger-visualizer .cursor', {
    translateX: anime.stagger(-cell, { grid, from: index, axis: 'x' }),
    translateY: anime.stagger(-cell, { grid, from: index, axis: 'y' }),
    scale: 1.3
  });

  function play(){
    const nextIndex = anime.random(0, numberOfElements-1);
    const tl = anime.timeline({ easing: 'easeInOutQuad', complete: play });
    tl.add({
      targets: '.stagger-visualizer .cursor',
      keyframes: [{ scale: .75, duration: 120 }, { scale: 2.5, duration: 220 }, { scale: 1.3, duration: 450 }],
      duration: 300
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
