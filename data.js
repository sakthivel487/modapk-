// ===== MOD APK DATA STORE =====
const APK_DATA = [
  {
    id: 1, slug: "minecraft-mod-apk",
    name: "Minecraft", version: "1.21.0", rating: 4.9, downloads: 982000,
    category: "games", subCategory: "adventure",
    size: "120 MB", android: "5.0+",
    modFeatures: ["Unlimited Money", "God Mode", "All Items Unlocked", "No Hunger"],
    icon: "⛏️", iconBg: "linear-gradient(135deg,#8B4513,#A0522D)",
    description: "Minecraft MOD APK gives you unlimited resources, god mode, and all items unlocked from the start. Build anything you can imagine without limits.",
    howToInstall: ["Enable Unknown Sources in Settings → Security","Download the MOD APK file","Open the downloaded file and tap Install","Wait for installation to complete","Open Minecraft and enjoy MOD features"],
    screenshots: [], featured: true, trending: true, uploadDate: "2025-04-25",
    downloadUrl: "#"
  },
  {
    id: 2, slug: "spotify-mod-apk",
    name: "Spotify Premium", version: "8.9.2", rating: 4.8, downloads: 756000,
    category: "apps", subCategory: "music",
    size: "65 MB", android: "6.0+",
    modFeatures: ["Premium Unlocked", "No Ads", "Unlimited Skips", "Download Songs"],
    icon: "🎵", iconBg: "linear-gradient(135deg,#1DB954,#17A74A)",
    description: "Spotify Premium MOD APK unlocks all premium features including ad-free listening, unlimited skips, and offline downloads — completely free.",
    howToInstall: ["Uninstall original Spotify if installed","Enable Unknown Sources in Settings","Download and install the MOD APK","Log in with your Spotify account","Enjoy all Premium features for free"],
    screenshots: [], featured: true, trending: true, uploadDate: "2025-04-26",
    downloadUrl: "#"
  },
  {
    id: 3, slug: "pubg-mobile-mod-apk",
    name: "PUBG Mobile", version: "3.2.0", rating: 4.7, downloads: 643000,
    category: "games", subCategory: "action",
    size: "780 MB", android: "5.1+",
    modFeatures: ["Aimbot", "Wallhack", "No Recoil", "Unlimited UC"],
    icon: "🎯", iconBg: "linear-gradient(135deg,#ff6348,#ff4757)",
    description: "PUBG Mobile MOD APK with enhanced features including better aim assist, visibility through walls, and reduced weapon recoil for better gameplay.",
    howToInstall: ["Download the APK + OBB file","Extract OBB to Android/obb folder","Install the APK","Launch the game","Features activate automatically"],
    screenshots: [], featured: true, trending: false, uploadDate: "2025-04-24",
    downloadUrl: "#"
  },
  {
    id: 4, slug: "youtube-vanced-mod-apk",
    name: "YouTube Vanced", version: "18.6.5", rating: 4.9, downloads: 1200000,
    category: "apps", subCategory: "entertainment",
    size: "78 MB", android: "5.0+",
    modFeatures: ["No Ads", "Background Play", "Picture in Picture", "AMOLED Dark Mode"],
    icon: "▶️", iconBg: "linear-gradient(135deg,#FF0000,#CC0000)",
    description: "YouTube Vanced MOD APK removes all ads, enables background playback, and adds features like AMOLED dark mode and SponsorBlock integration.",
    howToInstall: ["Install MicroG first (included)","Install YouTube Vanced APK","Open and sign in with Google","Enable Background Play in settings","Enjoy ad-free YouTube"],
    screenshots: [], featured: true, trending: true, uploadDate: "2025-04-27",
    downloadUrl: "#"
  },
  {
    id: 5, slug: "clash-of-clans-mod-apk",
    name: "Clash of Clans", version: "16.253.20", rating: 4.6, downloads: 523000,
    category: "games", subCategory: "strategy",
    size: "235 MB", android: "5.0+",
    modFeatures: ["Unlimited Gems", "Unlimited Gold", "Unlimited Elixir", "Instant Build"],
    icon: "⚔️", iconBg: "linear-gradient(135deg,#ffa502,#ff7f50)",
    description: "Clash of Clans MOD APK with unlimited gems, gold, and elixir. Build your village to max level instantly and dominate every battle.",
    howToInstall: ["Download the MOD APK","Enable Unknown Sources","Install the APK","Open the game (offline server)","All resources are unlimited"],
    screenshots: [], featured: false, trending: true, uploadDate: "2025-04-23",
    downloadUrl: "#"
  },
  {
    id: 6, slug: "netflix-mod-apk",
    name: "Netflix Premium", version: "8.103.0", rating: 4.8, downloads: 890000,
    category: "apps", subCategory: "entertainment",
    size: "88 MB", android: "5.0+",
    modFeatures: ["Premium Unlocked", "Ultra HD Streaming", "No Ads", "Download Content"],
    icon: "🎬", iconBg: "linear-gradient(135deg,#E50914,#B00710)",
    description: "Netflix Premium MOD APK unlocks full access to all movies, shows, and documentaries in Ultra HD quality without any subscription fees.",
    howToInstall: ["Uninstall original Netflix","Download MOD APK","Install the APK","Open and use any email to log in","All premium content unlocked"],
    screenshots: [], featured: false, trending: true, uploadDate: "2025-04-26",
    downloadUrl: "#"
  },
  {
    id: 7, slug: "gta-san-andreas-mod-apk",
    name: "GTA San Andreas", version: "2.11.32", rating: 4.8, downloads: 712000,
    category: "games", subCategory: "action",
    size: "1.5 GB", android: "4.0+",
    modFeatures: ["Unlimited Money", "Cheat Menu", "All Weapons Unlocked", "No Police"],
    icon: "🚗", iconBg: "linear-gradient(135deg,#ff4757,#ff6b81)",
    description: "GTA San Andreas MOD APK with unlimited money, all cheats unlocked in a menu, free weapons, and zero wanted level from police.",
    howToInstall: ["Download APK + OBB Data","Move OBB to Android/obb/com.rockstargames.gtasa","Install APK","Launch game","Access cheat menu in-game"],
    screenshots: [], featured: false, trending: false, uploadDate: "2025-04-20",
    downloadUrl: "#"
  },
  {
    id: 8, slug: "instagram-mod-apk",
    name: "Instagram Pro", version: "327.0.0", rating: 4.5, downloads: 445000,
    category: "apps", subCategory: "social",
    size: "72 MB", android: "6.0+",
    modFeatures: ["Download Photos/Videos", "No Ads", "See Story Without Viewed", "Dark Mode"],
    icon: "📸", iconBg: "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)",
    description: "Instagram Pro MOD APK lets you download any photo or video, see stories anonymously, and removes all ads with an always-on dark mode.",
    howToInstall: ["Uninstall original Instagram","Download MOD APK","Install the file","Log in with your account","Enjoy extra features"],
    screenshots: [], featured: false, trending: false, uploadDate: "2025-04-22",
    downloadUrl: "#"
  },
  {
    id: 9, slug: "free-fire-mod-apk",
    name: "Free Fire MAX", version: "2.106.1", rating: 4.5, downloads: 534000,
    category: "games", subCategory: "action",
    size: "680 MB", android: "4.1+",
    modFeatures: ["Aimbot", "Auto Headshot", "Unlimited Diamonds", "Wall Hack"],
    icon: "🔥", iconBg: "linear-gradient(135deg,#ff6b35,#f7c59f)",
    description: "Free Fire MAX MOD APK with auto-headshot, aimbot, wallhack and unlimited diamond generator. Dominate every match with ease.",
    howToInstall: ["Download APK file","Enable Unknown Sources","Install the APK","Open game and enjoy","Aimbot auto-activates"],
    screenshots: [], featured: false, trending: true, uploadDate: "2025-04-25",
    downloadUrl: "#"
  },
  {
    id: 10, slug: "tiktok-mod-apk",
    name: "TikTok Pro", version: "35.1.4", rating: 4.4, downloads: 380000,
    category: "apps", subCategory: "social",
    size: "65 MB", android: "5.0+",
    modFeatures: ["No Watermark Download", "No Ads", "Region Unlock", "Auto-Like Bot"],
    icon: "🎶", iconBg: "linear-gradient(135deg,#010101,#69C9D0)",
    description: "TikTok Pro MOD APK lets you download videos without watermark, removes all ads, unlocks region-blocked content, and more.",
    howToInstall: ["Uninstall original TikTok","Download MOD APK","Install the file","Log in with your account","Download button now appears on videos"],
    screenshots: [], featured: false, trending: false, uploadDate: "2025-04-21",
    downloadUrl: "#"
  },
  {
    id: 11, slug: "candy-crush-mod-apk",
    name: "Candy Crush Saga", version: "1.268.0", rating: 4.5, downloads: 295000,
    category: "games", subCategory: "puzzle",
    size: "95 MB", android: "4.4+",
    modFeatures: ["Unlimited Lives", "Unlimited Moves", "All Levels Unlocked", "No Ads"],
    icon: "🍬", iconBg: "linear-gradient(135deg,#fd79a8,#e84393)",
    description: "Candy Crush Saga MOD APK with unlimited lives and moves. All levels unlocked and no ads. Play freely without any restrictions.",
    howToInstall: ["Download the MOD APK","Enable Unknown Sources","Install the APK","Open game","All features active automatically"],
    screenshots: [], featured: false, trending: false, uploadDate: "2025-04-18",
    downloadUrl: "#"
  },
  {
    id: 12, slug: "adobe-photoshop-mod-apk",
    name: "Adobe Photoshop", version: "6.9.0", rating: 4.7, downloads: 412000,
    category: "apps", subCategory: "tools",
    size: "180 MB", android: "8.0+",
    modFeatures: ["Premium Unlocked", "All Filters", "No Subscription", "Full Features"],
    icon: "🎨", iconBg: "linear-gradient(135deg,#00b4d8,#0077b6)",
    description: "Adobe Photoshop MOD APK with all premium tools and filters unlocked for free. Professional photo editing without any subscription.",
    howToInstall: ["Download MOD APK","Disable Play Protect temporarily","Install the APK","Open and skip sign-in","All premium tools unlocked"],
    screenshots: [], featured: false, trending: false, uploadDate: "2025-04-19",
    downloadUrl: "#"
  }
];

// Helper: get by slug
function getApkBySlug(slug) {
  return APK_DATA.find(a => a.slug === slug) || null;
}

// Helper: filter
function filterApks({ category, subCategory, trending, featured, limit, sort } = {}) {
  let list = [...APK_DATA];
  if (category) list = list.filter(a => a.category === category);
  if (subCategory) list = list.filter(a => a.subCategory === subCategory);
  if (trending) list = list.filter(a => a.trending);
  if (featured) list = list.filter(a => a.featured);
  if (sort === 'popular') list.sort((a,b) => b.downloads - a.downloads);
  else if (sort === 'rating') list.sort((a,b) => b.rating - a.rating);
  else list.sort((a,b) => new Date(b.uploadDate) - new Date(a.uploadDate));
  if (limit) list = list.slice(0, limit);
  return list;
}

// Helper: search
function searchApks(query) {
  const q = query.toLowerCase();
  return APK_DATA.filter(a =>
    a.name.toLowerCase().includes(q) ||
    a.category.toLowerCase().includes(q) ||
    a.subCategory.toLowerCase().includes(q) ||
    a.modFeatures.some(f => f.toLowerCase().includes(q))
  );
}

// Helper: format downloads
function fmtDownloads(n) {
  if (n >= 1000000) return (n/1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n/1000).toFixed(0) + 'K';
  return n;
}

// Helper: star rating HTML
function starRating(r) {
  const full = Math.floor(r);
  const half = r % 1 >= 0.5 ? 1 : 0;
  let html = '';
  for (let i = 0; i < full; i++) html += '<i class="fa-solid fa-star"></i>';
  if (half) html += '<i class="fa-solid fa-star-half-stroke"></i>';
  return html;
}

// Helper: APK card HTML
function apkCardHTML(apk) {
  return `
  <div class="apk-card" onclick="window.location.href='app.html?slug=${apk.slug}'" id="card-${apk.id}">
    <div class="card-icon-wrap">
      <div class="card-icon" style="background:${apk.iconBg}">${apk.icon}</div>
      <div class="card-title-group">
        <div class="card-name">${apk.name}</div>
        <div class="card-version">v${apk.version}</div>
        <div class="card-rating">${starRating(apk.rating)} <span style="color:var(--text-muted)">${apk.rating}</span></div>
      </div>
    </div>
    <div class="card-body">
      <div class="card-mod-badge"><i class="fa-solid fa-circle-check"></i> ${apk.modFeatures[0]}</div>
      <div class="card-meta">
        <span><i class="fa-solid fa-box"></i> ${apk.size}</span>
        <span><i class="fa-brands fa-android"></i> ${apk.android}</span>
      </div>
    </div>
    <div class="card-footer">
      <button class="btn-download" onclick="event.stopPropagation();window.location.href='download.html?slug=${apk.slug}'">
        <i class="fa-solid fa-download"></i> Download MOD
      </button>
    </div>
  </div>`;
}
