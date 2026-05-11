require('dotenv').config();
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const session = require('express-session');
const path = require('path');

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

const app = express();

// Middleware
app.set('view engine', 'ejs');
// Note: In Cloud Functions, __dirname is the functions folder
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session for Admin Login
// In production on Firebase, standard cookies might be stripped unless named __session.
// We use __session as the cookie name to ensure Firebase Hosting passes it through.
app.use(session({
  name: '__session',
  secret: 'modvault-super-secret-key-123',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 86400000 }
}));

// Admin auth middleware
const requireAuth = (req, res, next) => {
  if (req.session.isAdmin) {
    next();
  } else {
    if (req.originalUrl.startsWith('/admin/api')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.redirect('/admin/login');
  }
};

// =======================
// DB HELPERS
// =======================
const getAllApks = async () => {
  const snapshot = await db.collection('apks').get();
  const apks = [];
  snapshot.forEach(doc => {
    apks.push({ id: doc.id, ...doc.data() });
  });
  return apks;
};

// =======================
// PUBLIC ROUTES
// =======================

app.get('/', async (req, res) => {
  try {
    const apks = await getAllApks();
    apks.sort((a, b) => b.downloads - a.downloads);
    res.render('index', { apks: apks.slice(0, 10), currentRoute: 'home' });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get('/games', async (req, res) => {
  try {
    const apks = await getAllApks();
    const games = apks.filter(a => a.category === 'games').sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date));
    res.render('games', { apks: games, currentRoute: 'games' });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

app.get('/apps', async (req, res) => {
  try {
    const apks = await getAllApks();
    const apps = apks.filter(a => a.category === 'apps').sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date));
    res.render('apps', { apks: apps, currentRoute: 'apps' });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

app.get('/app/:slug', async (req, res) => {
  try {
    const snapshot = await db.collection('apks').where('slug', '==', req.params.slug).limit(1).get();
    if (snapshot.empty) return res.status(404).send("App not found");
    
    const apk = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    
    // Fetch similar
    const simSnap = await db.collection('apks').where('category', '==', apk.category).limit(4).get();
    let similar = [];
    simSnap.forEach(doc => {
      if (doc.id !== apk.id) similar.push({ id: doc.id, ...doc.data() });
    });
    
    res.render('app', { apk, similar: similar.slice(0, 3), currentRoute: 'app' });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get('/search', async (req, res) => {
  const q = req.query.q || '';
  try {
    const apks = await getAllApks();
    const filtered = apks.filter(a => a.name.toLowerCase().includes(q.toLowerCase()));
    res.render('search', { apks: filtered, query: q, currentRoute: 'search' });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

app.get('/categories', (req, res) => res.render('categories', { currentRoute: 'categories' }));

app.get('/category/:name', async (req, res) => {
  try {
    const cat = req.params.name;
    const apks = await getAllApks();
    const filtered = apks.filter(a => a.sub_category === cat);
    res.render('search', { apks: filtered, query: cat, currentRoute: 'categories' });
  } catch(err) {
    res.status(500).send("Server Error");
  }
});

app.get('/latest', async (req, res) => {
  try {
    const apks = await getAllApks();
    apks.sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date));
    res.render('latest', { apks, currentRoute: 'latest' });
  } catch(err) {
    res.status(500).send("Server Error");
  }
});

app.get('/download/:slug', async (req, res) => {
  try {
    const snapshot = await db.collection('apks').where('slug', '==', req.params.slug).limit(1).get();
    if (snapshot.empty) return res.status(404).send("App not found");
    const apk = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    res.render('download', { apk, currentRoute: 'download' });
  } catch(err) {
    res.status(500).send("Server Error");
  }
});

// Legal/Static pages
app.get('/contact', (req, res) => res.render('contact', { currentRoute: 'contact' }));
app.get('/faq', (req, res) => res.render('faq', { currentRoute: 'faq' }));
app.get('/privacy', (req, res) => res.render('privacy', { currentRoute: 'privacy' }));
app.get('/terms', (req, res) => res.render('terms', { currentRoute: 'terms' }));
app.get('/disclaimer', (req, res) => res.render('disclaimer', { currentRoute: 'disclaimer' }));
app.get('/dmca', (req, res) => res.render('dmca', { currentRoute: 'dmca' }));


// =======================
// ADMIN ROUTES
// =======================

app.get('/admin/login', (req, res) => {
  if (req.session.isAdmin) return res.redirect('/admin');
  res.render('admin_login', { error: null });
});

app.post('/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === 'admin123') {
    req.session.isAdmin = true;
    res.redirect('/admin');
  } else {
    res.render('admin_login', { error: 'Invalid password' });
  }
});

app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

app.get('/admin', requireAuth, async (req, res) => {
  try {
    const apks = await getAllApks();
    apks.sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date));
    const totalDownloads = apks.reduce((sum, apk) => sum + (apk.downloads || 0), 0);
    const totalGames = apks.filter(a => a.category === 'games').length;
    const totalApps = apks.filter(a => a.category === 'apps').length;
    
    res.render('admin', { 
      apks, 
      stats: { total: apks.length, downloads: totalDownloads, games: totalGames, apps: totalApps }
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// API endpoint to create APK
app.post('/admin/api/apk', requireAuth, async (req, res) => {
  const { 
    name, version, category, sub_category, size, android_required, rating, 
    icon, download_url, mod_features, description, how_to_install 
  } = req.body;

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-mod-apk-' + Date.now().toString().slice(-4);
  const icon_bg = 'linear-gradient(135deg, #6c63ff, #a78bfa)';
  const upload_date = new Date().toISOString().split('T')[0];

  const featuresArr = mod_features ? mod_features.split('\n').filter(Boolean) : ['MOD Features'];
  const installArr = how_to_install ? how_to_install.split('\n').filter(Boolean) : ['Install and enjoy'];

  const newApk = {
    name, slug, version, category, sub_category, size, android_required,
    rating: parseFloat(rating) || 4.5, icon: icon || '📱', icon_bg, download_url, 
    mod_features: featuresArr, description, how_to_install: installArr, 
    upload_date, downloads: 0
  };

  try {
    const docRef = await db.collection('apks').add(newApk);
    res.json({ success: true, id: docRef.id, slug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API endpoint to delete APK
app.delete('/admin/api/apk/:id', requireAuth, async (req, res) => {
  try {
    await db.collection('apks').doc(req.params.id).delete();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seed Database Route (Run this once to populate)
app.get('/seed', async (req, res) => {
  try {
    const snap = await db.collection('apks').limit(1).get();
    if (!snap.empty) {
      return res.send("Database already seeded. <a href='/'>Go Home</a>");
    }

    const sampleApks = [
      {
        name: "Minecraft", slug: "minecraft-mod-apk", version: "1.21.0", category: "games", sub_category: "adventure",
        size: "120 MB", android_required: "5.0+", rating: 4.9, icon: "⛏️", icon_bg: "linear-gradient(135deg, #27ae60, #2ecc71)",
        download_url: "https://example.com/download/minecraft",
        mod_features: ["Unlimited Money", "Premium Skins Unlocked", "God Mode"],
        description: "Explore infinite worlds and build everything from the simplest of homes to the grandest of castles.",
        how_to_install: ["Enable Unknown Sources", "Download the APK", "Install and enjoy"],
        upload_date: new Date().toISOString().split('T')[0], downloads: 982000
      },
      {
        name: "Spotify Premium", slug: "spotify-premium-mod", version: "8.9.14", category: "apps", sub_category: "music",
        size: "65 MB", android_required: "6.0+", rating: 4.8, icon: "🎵", icon_bg: "linear-gradient(135deg, #1DB954, #1ed760)",
        download_url: "https://example.com/download/spotify",
        mod_features: ["No Ads", "Unlimited Skips", "Offline Download Unlocked"],
        description: "Listen to all your favorite music and podcasts without any interruptions.",
        how_to_install: ["Uninstall original Spotify", "Download this MOD", "Login with a new account"],
        upload_date: new Date().toISOString().split('T')[0], downloads: 1500000
      }
    ];

    const batch = db.batch();
    sampleApks.forEach(apk => {
      const docRef = db.collection('apks').doc();
      batch.set(docRef, apk);
    });
    
    await batch.commit();
    res.send("Database seeded successfully! <a href='/'>Go Home</a>");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Export the Express app as a Firebase Cloud Function named 'app'
exports.app = functions.https.onRequest(app);

// For local testing without emulators
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running locally on http://localhost:${PORT}`);
  });
}
