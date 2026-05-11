// ===== APP DETAIL PAGE LOGIC =====

const SAMPLE_COMMENTS = [
  { name: "Rahul K", text: "Working perfectly! Unlimited money is actually unlimited. Thanks ModVault!", date: "2025-04-26" },
  { name: "Priya S", text: "Finally a site that actually works. Downloaded and installed in 2 minutes.", date: "2025-04-25" },
  { name: "Ahmed M", text: "MOD features are all working. No ban so far. 10/10!", date: "2025-04-24" }
];

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initNavSearch();
  initHamburger();
  loadApp();
});

function loadApp() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const apk = slug ? getApkBySlug(slug) : APK_DATA[0];

  if (!apk) {
    document.getElementById('app-main').innerHTML = '<div class="container" style="padding:8rem 5%;text-align:center"><h2>App not found</h2><a href="index.html" class="btn-primary" style="margin-top:1rem">Go Home</a></div>';
    return;
  }

  // Page meta
  document.getElementById('page-title').textContent = `${apk.name} MOD APK v${apk.version} - ModVault`;
  document.getElementById('page-desc').content = `Download ${apk.name} MOD APK v${apk.version} free. ${apk.modFeatures.join(', ')}.`;

  // Breadcrumb
  document.getElementById('bc-cat').textContent = capitalize(apk.category);
  document.getElementById('bc-cat').href = `${apk.category}.html`;
  document.getElementById('bc-name').textContent = apk.name;

  // Icon
  const iconEl = document.getElementById('app-icon-large');
  iconEl.textContent = apk.icon;
  iconEl.style.background = apk.iconBg;

  // Header info
  document.getElementById('app-name').textContent = `${apk.name} MOD APK`;
  document.getElementById('app-version').textContent = `Version ${apk.version} • ${apk.size} • Android ${apk.android}+`;
  document.getElementById('app-cat-badge').innerHTML = `<i class="fa-solid fa-tag"></i> ${capitalize(apk.subCategory)}`;
  document.getElementById('app-stars').innerHTML = `
    ${starRating(apk.rating)}
    <span>${apk.rating} (${fmtDownloads(Math.floor(apk.downloads/100))} reviews)</span>
    &nbsp;•&nbsp; <i class="fa-solid fa-download" style="font-size:0.8rem"></i>
    <span>${fmtDownloads(apk.downloads)} Downloads</span>`;

  // Info table
  document.getElementById('app-info-table').innerHTML = `
    <div class="info-cell">
      <i class="fa-solid fa-code-branch info-cell-icon"></i>
      <span class="info-cell-label">Version</span>
      <span class="info-cell-value">v${apk.version}</span>
    </div>
    <div class="info-cell">
      <i class="fa-solid fa-box info-cell-icon"></i>
      <span class="info-cell-label">File Size</span>
      <span class="info-cell-value">${apk.size}</span>
    </div>
    <div class="info-cell">
      <i class="fa-brands fa-android info-cell-icon"></i>
      <span class="info-cell-label">Android</span>
      <span class="info-cell-value">${apk.android}</span>
    </div>
    <div class="info-cell">
      <i class="fa-solid fa-calendar info-cell-icon"></i>
      <span class="info-cell-label">Updated</span>
      <span class="info-cell-value">${formatDate(apk.uploadDate)}</span>
    </div>`;

  // MOD Features
  document.getElementById('mod-features').innerHTML = apk.modFeatures.map(f => `
    <div class="mod-feature-item"><i class="fa-solid fa-circle-check"></i> ${f}</div>`).join('');

  // Description
  document.getElementById('app-description').textContent = apk.description;

  // Install steps
  document.getElementById('install-steps').innerHTML = apk.howToInstall.map((step, i) => `
    <div class="install-step">
      <div class="step-num">${i + 1}</div>
      <div class="step-text">${step}</div>
    </div>`).join('');

  // Download box
  document.getElementById('dl-icon').textContent = apk.icon;
  document.getElementById('dl-icon').style.background = apk.iconBg;
  document.getElementById('dl-name').textContent = `${apk.name} MOD APK v${apk.version}`;
  document.getElementById('dl-meta').textContent = `${apk.size} • Android ${apk.android} • Free`;

  // Comments
  renderComments(apk.slug);

  // Related
  const related = APK_DATA.filter(a => a.category === apk.category && a.id !== apk.id).slice(0, 4);
  document.getElementById('related-grid').innerHTML = related.map(apkCardHTML).join('');

  // JSON-LD schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": apk.name,
    "operatingSystem": "Android",
    "applicationCategory": apk.category === 'games' ? 'GameApplication' : 'MobileApplication',
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": apk.rating, "reviewCount": Math.floor(apk.downloads / 100) }
  };
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify(schema);
  document.head.appendChild(s);
}

function goDownload() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug') || APK_DATA[0].slug;
  window.location.href = `download.html?slug=${slug}`;
}

function shareApp() {
  if (navigator.share) {
    navigator.share({ title: document.title, url: window.location.href });
  } else {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link copied to clipboard!');
  }
}

function renderComments(slug) {
  const stored = JSON.parse(localStorage.getItem(`comments_${slug}`) || '[]');
  const all = [...SAMPLE_COMMENTS, ...stored];
  const list = document.getElementById('comments-list');
  list.innerHTML = all.map(c => `
    <div class="comment-item">
      <div class="comment-header">
        <div class="comment-avatar">${c.name.charAt(0).toUpperCase()}</div>
        <span class="comment-author">${c.name}</span>
        <span class="comment-date">${formatDate(c.date)}</span>
      </div>
      <div class="comment-body">${c.text}</div>
    </div>`).join('');
}

function submitComment() {
  const name = document.getElementById('comment-name').value.trim();
  const text = document.getElementById('comment-text').value.trim();
  if (!name || !text) { showToast('Please fill in both fields.'); return; }

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug') || APK_DATA[0].slug;
  const stored = JSON.parse(localStorage.getItem(`comments_${slug}`) || '[]');
  stored.push({ name, text, date: new Date().toISOString().split('T')[0] });
  localStorage.setItem(`comments_${slug}`, JSON.stringify(stored));

  document.getElementById('comment-name').value = '';
  document.getElementById('comment-text').value = '';
  renderComments(slug);
  showToast('Comment posted!');
}

function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:var(--bg-card);border:1px solid var(--border);color:var(--text-primary);padding:0.75rem 1.5rem;border-radius:50px;font-size:0.9rem;font-weight:600;z-index:9999;opacity:0;transition:opacity 0.3s';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  setTimeout(() => t.style.opacity = '0', 2800);
}
