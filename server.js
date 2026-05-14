require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 🔌 DATABASE INITIALIZATION (HYBRID)
// ==========================================
let dbMode = 'sqlite';
let sqliteDb;
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

// Detect if running on Vercel or any serverless environment
const isServerless = !!(process.env.VERCEL || process.env.VERCEL_ENV || process.env.AWS_LAMBDA_FUNCTION_NAME);

// Check for Cloud Key in ENV or File
const hasEnvKey = process.env.FIREBASE_SERVICE_ACCOUNT && !process.env.FIREBASE_SERVICE_ACCOUNT.startsWith('#');

if (fs.existsSync(serviceAccountPath) || hasEnvKey) {
  try {
    let serviceAccount;
    if (hasEnvKey) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else if (fs.existsSync(serviceAccountPath)) {
      serviceAccount = require(serviceAccountPath);
    }

    if (serviceAccount && serviceAccount.private_key) {
      // Clean private key for production environments
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: serviceAccount.project_id
        });
      }
      dbMode = 'firestore';
      console.log("🚀 PRODUCTION MODE: Cloud Firestore Active");
    }
  } catch (err) {
    console.error("⚠️ Firebase init error:", err.message);
    if (isServerless) {
      console.error("❌ FATAL: Cannot use SQLite on serverless. Set FIREBASE_SERVICE_ACCOUNT env var on Vercel.");
      process.exit(1);
    }
  }
}

// Only use SQLite locally — never on Vercel/serverless
if (dbMode === 'sqlite') {
  if (isServerless) {
    console.error("❌ FATAL: No FIREBASE_SERVICE_ACCOUNT found. SQLite cannot run on Vercel.");
    console.error("👉 Fix: Go to Vercel Dashboard → Settings → Environment Variables → Add FIREBASE_SERVICE_ACCOUNT");
    process.exit(1);
  }
  sqliteDb = require('./database');
  console.log("🏠 LOCAL MODE: SQLite Active");
}

const firestore = dbMode === 'firestore' ? admin.firestore() : null;

// ==========================================
// 🛠️ ROBUST DATA HELPERS
// ==========================================
const safeGetApks = async () => {
  try {
    if (dbMode === 'firestore') {
      const snap = await firestore.collection('apks').orderBy('downloads', 'desc').get();
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else {
      return new Promise((res, rej) => {
        sqliteDb.all('SELECT * FROM apks ORDER BY downloads DESC', (err, rows) => {
          if (err) rej(err); else res(rows || []);
        });
      });
    }
  } catch (err) {
    console.error("DB Query Error:", err);
    return [];
  }
};

const safeGetApkBySlug = async (slug) => {
  try {
    if (dbMode === 'firestore') {
      const snap = await firestore.collection('apks').where('slug', '==', slug).limit(1).get();
      return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
    } else {
      return new Promise((res, rej) => {
        sqliteDb.get('SELECT * FROM apks WHERE slug = ?', [slug], (err, row) => {
          if (err) rej(err); else res(row || null);
        });
      });
    }
  } catch (err) {
    console.error("DB Slug Query Error:", err);
    return null;
  }
};

// ==========================================
// 🚀 EXPRESS CONFIG (PRODUCTION READY)
// ==========================================
app.set('view engine', 'ejs');

// Handle view paths for both root and functions deployment
const viewsPath = fs.existsSync(path.join(__dirname, 'views')) 
  ? path.join(__dirname, 'views') 
  : path.join(__dirname, 'functions', 'views');
app.set('views', viewsPath);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session with Production Cookie Name + MongoDB Store
app.use(session({
  name: '__session', // Required for Firebase Hosting
  secret: 'modvault-super-secret-key-123',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
    ttl: 7 * 24 * 60 * 60 // 7 days
  }),
  cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 * 7 }
}));

// Global State
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.isAdmin = req.session.isAdmin || false;
  res.locals.currentRoute = req.path;
  next();
});

// Auth Middleware
const requireAdmin = (req, res, next) => {
  if (req.session.isAdmin) next();
  else res.redirect('/admin/login');
};

// ==========================================
// 🌐 ROUTES
// ==========================================

app.get('/', async (req, res) => {
  const apks = await safeGetApks();
  const processed = apks.map(apk => ({
    ...apk,
    mod_features: typeof apk.mod_features === 'string' ? JSON.parse(apk.mod_features) : (apk.mod_features || [])
  }));
  res.render('index', { apks: processed, stats: { apks: apks.length, downloads: '1M+' } });
});

app.get('/app/:slug', async (req, res) => {
  const apk = await safeGetApkBySlug(req.params.slug);
  if (!apk) return res.status(404).render('search', { apks: [], query: 'Not Found', error: 'App not found' });
  
  apk.mod_features = typeof apk.mod_features === 'string' ? JSON.parse(apk.mod_features) : (apk.mod_features || []);
  apk.how_to_install = typeof apk.how_to_install === 'string' ? JSON.parse(apk.how_to_install) : (apk.how_to_install || []);
  
  res.render('app', { apk, similar: [] });
});

app.get('/admin/login', (req, res) => {
  if (req.session.isAdmin) return res.redirect('/admin');
  res.render('admin_login', { error: null });
});

app.post('/admin/login', (req, res) => {
  if (req.body.password === 'admin123') {
    req.session.isAdmin = true;
    res.redirect('/admin');
  } else {
    res.render('admin_login', { error: 'Invalid password' });
  }
});

app.get('/admin', requireAdmin, async (req, res) => {
  const apks = await safeGetApks();
  res.render('admin', { apks, stats: { total: apks.length, downloads: 0, games: 0, apps: 0 } });
});

app.post('/api/firebase-auth', async (req, res) => {
  const { email, name } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    let user;
    if (dbMode === 'firestore') {
      const userRef = firestore.collection('users').doc(email);
      const doc = await userRef.get();
      if (!doc.exists) {
        user = { name, email, role: 'user', join_date: new Date().toISOString() };
        await userRef.set(user);
      } else user = doc.data();
    } else {
      user = { name, email, role: 'user' }; // Simpler local login
    }
    req.session.user = user;
    res.json({ success: true, user });
  } catch (err) { res.status(500).json({ error: 'Auth failed' }); }
});

// ==========================================
// 🚪 404 & ERROR HANDLING (PREVENTS CRASHES)
// ==========================================

// 404 Handler
app.use((req, res) => {
  res.status(404).render('index', { apks: [], stats: { apks: 0, downloads: 0 }, error: "Page Not Found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err.stack);
  res.status(500).send("Something went wrong! Please try again later.");
});

app.listen(PORT, () => {
  console.log(`✅ ModVault is Live in ${dbMode.toUpperCase()} mode on port ${PORT}`);
});
