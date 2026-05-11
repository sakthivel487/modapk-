// Auth Modals UI functions
function openAuth(type) {
    closeAuth();
    document.getElementById(type + 'Page').classList.add('active');
}

function closeAuth() {
    document.querySelectorAll('.auth-wrapper').forEach(p => p.classList.remove('active'));
}

function switchAuth(type) {
    closeAuth();
    setTimeout(() => openAuth(type), 100);
}

function forgotPassword() {
    closeAuth();
    setTimeout(() => openAuth('forgot'), 100);
}

function togglePassword(id, btn) {
    const input = document.getElementById(id);
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

function checkPasswordStrength(pass) {
    const strength = document.getElementById('passStrength');
    const fill = document.getElementById('passStrengthFill');
    const label = document.getElementById('passStrengthLabel');

    if (!pass) { strength.classList.remove('show'); return; }
    strength.classList.add('show');

    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    const levels = [
        { w: '20%', c: '#ff3344', t: 'Very Weak' },
        { w: '40%', c: '#ff6600', t: 'Weak' },
        { w: '60%', c: '#ffc107', t: 'Fair' },
        { w: '80%', c: '#00d4ff', t: 'Good' },
        { w: '100%', c: '#00ff88', t: 'Strong' }
    ];
    const level = levels[Math.min(score - 1, 4)] || levels[0];
    fill.style.width = level.w;
    fill.style.background = level.c;
    label.textContent = level.t;
    label.style.color = level.c;
}

function showToast(msg, type = 'info') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');

    toast.className = 'toast show ' + type;
    toastMsg.textContent = msg;

    // Icon based on type
    const i = toast.querySelector('i');
    if (type === 'success') i.className = 'fas fa-check-circle';
    else if (type === 'error') i.className = 'fas fa-exclamation-circle';
    else i.className = 'fas fa-info-circle';

    setTimeout(() => toast.classList.remove('show'), 3000);
}

function showError(id, msg) {
    const el = document.getElementById(id);
    el.querySelector('span').textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 4000);
}

function showSuccess(id, msg) {
    const el = document.getElementById(id);
    el.querySelector('span').textContent = msg;
    el.classList.add('show');
}

// User Menu Dropdown
function toggleUserDropdown() {
    document.getElementById('userDropdown').classList.toggle('open');
}
function closeUserDropdown() {
    const dd = document.getElementById('userDropdown');
    if (dd) dd.classList.remove('open');
}

document.addEventListener('click', e => {
    if (!e.target.closest('.user-menu')) closeUserDropdown();
});

// Auth API Calls
async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const pass = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;
    const btn = document.getElementById('signupBtn');

    if (pass.length < 6) return showError('signupError', 'Password must be at least 6 characters!');
    if (pass !== confirm) return showError('signupError', 'Passwords do not match!');

    btn.classList.add('loading');
    btn.innerHTML = '<i class="fas fa-spinner"></i> Creating account...';

    try {
        const res = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, username, email, password: pass })
        });
        const data = await res.json();

        if (data.error) throw new Error(data.error);

        showSuccess('signupSuccess', 'Account created! Logging in...');
        showToast(`Welcome to ModZone, ${name}! 🎉`, 'success');

        setTimeout(() => {
            window.location.reload();
        }, 1200);

    } catch (err) {
        showError('signupError', err.message);
        btn.classList.remove('loading');
        btn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPassword').value;
    const btn = document.getElementById('loginBtn');

    btn.classList.add('loading');
    btn.innerHTML = '<i class="fas fa-spinner"></i> Logging in...';

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: pass })
        });
        const data = await res.json();

        if (data.error) throw new Error(data.error);

        showToast(`Welcome back, ${data.user.name}! 🎉`, 'success');

        setTimeout(() => {
            window.location.reload();
        }, 800);

    } catch (err) {
        showError('loginError', err.message);
        btn.classList.remove('loading');
        btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
    }
}

async function logout() {
    if (!confirm('Are you sure you want to logout?')) return;

    try {
        await fetch('/api/logout', { method: 'POST' });
        showToast('Logged out successfully! 👋', 'info');
        setTimeout(() => {
            window.location.href = '/';
        }, 800);
    } catch (err) {
        console.error(err);
    }
}

function handleForgot(e) {
    e.preventDefault();
    const email = document.getElementById('forgotEmail').value.trim();
    showSuccess('forgotSuccess', `Reset link sent to ${email}! (Demo mode)`);
    showToast('Password reset link sent! 📧', 'success');
    setTimeout(() => {
        closeAuth();
        document.getElementById('forgotEmail').value = '';
    }, 2000);
}

async function socialLogin(provider) {
    if (provider !== 'Google') {
        showToast(`${provider} login coming soon! 🚀`, 'info');
        return;
    }

    if (!window.firebaseAuth) {
        showToast('Firebase not initialized!', 'error');
        return;
    }

    const { auth, googleProvider, signInWithPopup } = window.firebaseAuth;

    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        showToast(`Signed in as ${user.displayName}! Syncing...`, 'info');

        // Sync with local backend
        const res = await fetch('/api/firebase-auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uid: user.uid,
                email: user.email,
                name: user.displayName,
                photoURL: user.photoURL
            })
        });

        const data = await res.json();
        if (data.success) {
            showToast(`Welcome, ${user.displayName}! 🎉`, 'success');
            setTimeout(() => window.location.reload(), 1000);
        } else {
            throw new Error(data.error || 'Sync failed');
        }

    } catch (err) {
        console.error(err);
        showToast(err.message, 'error');
    }
}

async function startDownload(slug) {
    // Check if user is logged in (handled by template variable typically)
    // We can assume if this function is called, the user clicked it.

    try {
        // Ping backend to record download
        const res = await fetch(`/api/download/${slug}`, { method: 'POST' });
        const data = await res.json();

        if (data.error) {
            if (data.error.includes('login') || res.status === 401 || res.redirected) {
                showToast('Please login to download! 🔒', 'error');
                openAuth('login');
                return;
            }
            throw new Error(data.error);
        }

        showToast(`Download started! ⬇️`, 'success');

        // Actually redirect to the download page
        setTimeout(() => {
            window.location.href = `/download/${slug}`;
        }, 1000);
    } catch (err) {
        showToast(err.message, 'error');
    }
}
