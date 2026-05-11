// ===== MAIN.JS — Home page logic =====

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initParticles();
  initNavSearch();
  initHeroSearch();
  initStats();
  renderTrending();
  renderGames();
  renderApps();
  renderLatest();
  initHamburger();
});

// ===== NAVBAR SCROLL =====
function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  });
}

// ===== HAMBURGER =====
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn) return;
  btn.addEventListener('click', () => menu.classList.toggle('open'));
}

// ===== PARTICLES =====
function initParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left:${Math.random()*100}%;
      animation-duration:${6+Math.random()*12}s;
      animation-delay:${Math.random()*10}s;
      width:${1+Math.random()*2}px;
      height:${1+Math.random()*2}px;
      background:${Math.random()>0.5?'#6c63ff':'#00d4aa'};
      opacity:0;
    `;
    container.appendChild(p);
  }
}

// ===== NAV LIVE SEARCH =====
function initNavSearch() {
  const input = document.getElementById('nav-search-input');
  const dropdown = document.getElementById('search-dropdown');
  if (!input) return;

  let debounce;
  input.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const q = input.value.trim();
      if (q.length < 2) { dropdown.classList.remove('active'); return; }
      const results = searchApks(q).slice(0, 6);
      if (!results.length) { dropdown.classList.remove('active'); return; }
      dropdown.innerHTML = results.map(a => `
        <div class="search-result-item" onclick="window.location.href='app.html?slug=${a.slug}'">
          <div class="sri-icon" style="background:${a.iconBg}">${a.icon}</div>
          <div class="sri-info">
            <div class="sri-name">${a.name}</div>
            <div class="sri-cat">${capitalize(a.category)} • ${a.modFeatures[0]}</div>
          </div>
        </div>`).join('');
      dropdown.classList.add('active');
    }, 250);
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('#nav-search-wrap')) dropdown.classList.remove('active');
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && input.value.trim()) {
      window.location.href = `search.html?q=${encodeURIComponent(input.value.trim())}`;
    }
  });
}

// ===== HERO SEARCH =====
function initHeroSearch() {
  const input = document.getElementById('hero-search');
  if (!input) return;
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') heroSearch();
  });
}

function heroSearch() {
  const q = document.getElementById('hero-search').value.trim();
  if (q) window.location.href = `search.html?q=${encodeURIComponent(q)}`;
}

// ===== ANIMATED STATS =====
function initStats() {
  const nums = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  nums.forEach(n => observer.observe(n));
}

function animateCount(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);
    el.textContent = target >= 1000000
      ? (value / 1000000).toFixed(1) + 'M'
      : target >= 1000 ? (value / 1000).toFixed(0) + 'K'
      : value;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target >= 1000000
      ? (target/1000000).toFixed(1) + 'M'
      : target >= 1000 ? target/1000 + 'K' : target;
  }
  requestAnimationFrame(step);
}

// ===== RENDER SECTIONS =====
function renderTrending() {
  const grid = document.getElementById('trending-grid');
  if (!grid) return;
  const items = filterApks({ trending: true, limit: 4, sort: 'popular' });
  grid.innerHTML = items.map(apkCardHTML).join('');
}

function renderGames() {
  const grid = document.getElementById('games-grid');
  if (!grid) return;
  const items = filterApks({ category: 'games', limit: 4, sort: 'popular' });
  grid.innerHTML = items.map(apkCardHTML).join('');
}

function renderApps() {
  const grid = document.getElementById('apps-grid');
  if (!grid) return;
  const items = filterApks({ category: 'apps', limit: 4, sort: 'popular' });
  grid.innerHTML = items.map(apkCardHTML).join('');
}

function renderLatest() {
  const list = document.getElementById('latest-list');
  if (!list) return;
  const items = filterApks({ limit: 8, sort: 'latest' });
  list.innerHTML = items.map(a => `
    <div class="latest-item" onclick="window.location.href='app.html?slug=${a.slug}'">
      <div class="latest-icon" style="background:${a.iconBg}">${a.icon}</div>
      <div class="latest-info">
        <div class="latest-name">${a.name}</div>
        <div class="latest-sub">${capitalize(a.category)} • ${a.size} • Android ${a.android}</div>
      </div>
      <div class="latest-meta">
        <div class="latest-version">v${a.version}</div>
        <div class="latest-date">${formatDate(a.uploadDate)}</div>
        <div class="latest-badge mt-1">MOD</div>
      </div>
    </div>`).join('');
}

// ===== UTILS =====
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
