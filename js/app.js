/* ═══════════════════════════════════════════
   KALINGA — Main Application JavaScript
   Pure frontend / localStorage prototype
   Rebuilt to match the fixed-view index.html shell
═══════════════════════════════════════════ */

const App = (() => {

/* ───────────────────────────────────────────
   SEED DATA
─────────────────────────────────────────── */
const SEED = {
  providers: [
    { id:'p1', name:'Maria Santos', role:'provider', email:'maria@demo.com', password:'123456',
      specialty:'elderly', specialtyLabel:'Elderly Care', rating:4.8, ratingCount:24, rate:350,
      available:true, lat:14.5995, lng:120.9842, bio:'10+ years of experience in senior care.',
      avatar:'MS', color:'#1565C0' },
    { id:'p2', name:'Jose Reyes', role:'provider', email:'jose@demo.com', password:'123456',
      specialty:'patient', specialtyLabel:'Patient Assistance', rating:4.6, ratingCount:18, rate:500,
      available:true, lat:14.6100, lng:120.9780, bio:'Licensed physical therapist, home-visit specialist.',
      avatar:'JR', color:'#00897B' },
    { id:'p3', name:'Luz Diaz', role:'provider', email:'luz@demo.com', password:'123456',
      specialty:'child', specialtyLabel:'Child Care', rating:4.9, ratingCount:31, rate:400,
      available:false, lat:14.5880, lng:121.0000, bio:'Pediatric nurse turned full-time childcare specialist.',
      avatar:'LD', color:'#7B1FA2' },
    { id:'p4', name:'Roberto Cruz', role:'provider', email:'roberto@demo.com', password:'123456',
      specialty:'patient', specialtyLabel:'Post-Surgery Care', rating:4.5, ratingCount:15, rate:600,
      available:true, lat:14.6050, lng:120.9900, bio:'Former ICU nurse with post-op specialization.',
      avatar:'RC', color:'#E53935' },
    { id:'p5', name:'Ana Villanueva', role:'provider', email:'ana@demo.com', password:'123456',
      specialty:'housekeeper', specialtyLabel:'Housekeeper', rating:4.7, ratingCount:20, rate:300,
      available:true, lat:14.5920, lng:120.9920, bio:'Detail-oriented housekeeping & home organization.',
      avatar:'AV', color:'#0288D1' },
    { id:'p6', name:'Danny Gomez', role:'provider', email:'danny@demo.com', password:'123456',
      specialty:'elderly', specialtyLabel:'Elderly & Dementia Care', rating:4.4, ratingCount:9, rate:480,
      available:true, lat:14.6150, lng:120.9850, bio:'Mental health aide with dementia care training.',
      avatar:'DG', color:'#388E3C' },
    { id:'p7', name:'Carla Mendoza', role:'provider', email:'carla@demo.com', password:'123456',
      specialty:'cooking', specialtyLabel:'Cooking Assistance', rating:4.3, ratingCount:11, rate:320,
      available:false, lat:14.5850, lng:120.9780, bio:'Specializes in diabetic-friendly meal prep.',
      avatar:'CM', color:'#F57C00' }
  ],
  users: [
    { id:'u1', name:'Carlos Client', role:'client', email:'client@demo.com', password:'123456', avatar:'CC', color:'#1565C0' },
    { id:'u2', name:'Admin User', role:'admin', email:'admin@demo.com', password:'admin123', avatar:'AU', color:'#7B1FA2' }
  ],
  requests: [
    { id:'r1', clientId:'u1', type:'elderly', datetime:'2026-06-24T09:00', duration:4, budget:'1200 - 1600', priority:'regular', status:'open', providerId:null, createdAt:Date.now()-86400000 },
    { id:'r2', clientId:'u1', type:'cooking', datetime:'2026-06-23T07:00', duration:2, budget:'400 - 600', priority:'emergency', status:'open', providerId:null, createdAt:Date.now()-3600000 }
  ],
  bookings: [
    { id:'b1', clientId:'u1', providerId:'p1', providerName:'Maria Santos', service:'Elderly Care',
      date:'2026-06-22', time:'09:00', duration:4, budget:1400, status:'confirmed',
      notes:'Daily medication check needed.', createdAt:'2026-06-18T08:00:00Z' },
    { id:'b2', clientId:'u1', providerId:'p2', providerName:'Jose Reyes', service:'Patient Assistance',
      date:'2026-06-25', time:'14:00', duration:2, budget:1000, status:'pending',
      notes:'Knee rehabilitation exercises.', createdAt:'2026-06-19T10:00:00Z' },
    { id:'b3', clientId:'u1', providerId:'p4', providerName:'Roberto Cruz', service:'Post-Surgery Care',
      date:'2026-06-10', time:'08:00', duration:6, budget:3600, status:'completed',
      notes:'Post-appendectomy wound care.', createdAt:'2026-06-05T09:00:00Z' }
  ],
  chats: {
    'u1-p1': [
      { from:'p1', text:"Good morning! I'm ready for your grandparent's care schedule.", time:'09:15 AM' },
      { from:'u1', text:'Hi Maria! Great. Please be here at 9 AM on Monday.', time:'09:17 AM' },
      { from:'p1', text:"Noted! I'll bring the medication checklist. See you then!", time:'09:18 AM' }
    ],
    'u1-p2': [
      { from:'p2', text:'Hello! I reviewed the physiotherapy plan. Looking good.', time:'02:00 PM' },
      { from:'u1', text:'Thank you Jose. Will my father be able to walk unassisted?', time:'02:05 PM' },
      { from:'p2', text:"With consistent sessions, yes! We'll target 6 weeks.", time:'02:07 PM' }
    ]
  },
  ratings: [
    { providerId:'p1', clientId:'u1', score:5, comment:'Maria is incredibly patient and kind!', date:'2026-06-11' },
    { providerId:'p4', clientId:'u1', score:4, comment:'Very professional, would hire again.', date:'2026-06-11' }
  ],
  notifications: [
    { id:'n1', text:'Your booking with Maria Santos is confirmed!', icon:'fa-calendar-check', time:'2 hours ago', read:false },
    { id:'n2', text:'Jose Reyes accepted your physical therapy request.', icon:'fa-user-check', time:'5 hours ago', read:false },
    { id:'n3', text:'New provider available in your area: Danny Gomez', icon:'fa-bell', time:'1 day ago', read:true }
  ],
  verifications: [
    { provider:'Danny Gomez', specialty:'Elderly & Dementia Care', docs:'3 files uploaded', status:'pending' },
    { provider:'Carla Mendoza', specialty:'Cooking Assistance', docs:'2 files uploaded', status:'pending' }
  ],
  complaints: [
    { bookingId:'b2', issue:'Provider arrived 40 minutes late', severity:'medium', status:'open' },
    { bookingId:'b3', issue:'Disputed final invoice amount', severity:'high', status:'open' }
  ]
};

/* ───────────────────────────────────────────
   STORAGE
─────────────────────────────────────────── */
const Store = {
  get(key, fallback = null) {
    try { const v = localStorage.getItem('kalinga_' + key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem('kalinga_' + key, JSON.stringify(value)); }
    catch (e) { console.warn('Store.set failed:', e); }
  },
  update(key, updater, fallback = null) {
    const updated = updater(this.get(key, fallback));
    this.set(key, updated);
    return updated;
  }
};

function initSeed() {
  if (!Store.get('seeded')) {
    Store.set('providers', SEED.providers);
    Store.set('users', SEED.users);
    Store.set('requests', SEED.requests);
    Store.set('bookings', SEED.bookings);
    Store.set('chats', SEED.chats);
    Store.set('ratings', SEED.ratings);
    Store.set('notifications', SEED.notifications);
    Store.set('verifications', SEED.verifications);
    Store.set('complaints', SEED.complaints);
    Store.set('seeded', true);
  }
}

/* ───────────────────────────────────────────
   HELPERS
─────────────────────────────────────────── */
function el(id) { return document.getElementById(id); }
function show(idEl) { idEl && idEl.classList.remove('hidden'); }
function hide(idEl) { idEl && idEl.classList.add('hidden'); }
function fmtDate(d) { try { return new Date(d).toLocaleString('en-US', { month:'short', day:'numeric', hour:'numeric', minute:'2-digit' }); } catch { return d; } }
function starsHTML(rating, size = 12) {
  const full = Math.round(rating);
  let s = '';
  for (let i = 1; i <= 5; i++) s += `<i class="fa-solid fa-star" style="font-size:${size}px;${i <= full ? '' : 'opacity:.25;'}"></i>`;
  return s;
}
const TYPE_LABELS = { elderly:'Elderly Care', child:'Child Care / Nanny', housekeeper:'Housekeeper', cooking:'Cooking Assistance', patient:'Specialized Patient Care' };

/* ───────────────────────────────────────────
   TOAST
─────────────────────────────────────────── */
const toast = {
  show(msg, type = 'default', duration = 3000) {
    const icons = { success:'fa-circle-check', danger:'fa-circle-xmark', warning:'fa-triangle-exclamation', default:'fa-circle-info' };
    const node = document.createElement('div');
    node.className = `toast ${type}`;
    node.innerHTML = `<i class="fa-solid ${icons[type] || icons.default}"></i> ${msg}`;
    el('toast-container').appendChild(node);
    setTimeout(() => {
      node.style.opacity = '0'; node.style.transform = 'translateY(-20px)'; node.style.transition = '.3s';
      setTimeout(() => node.remove(), 300);
    }, duration);
  }
};

/* ───────────────────────────────────────────
   UI / MODAL
─────────────────────────────────────────── */
const ui = {
  openModal(html) {
    el('modal-content').innerHTML = html;
    show(el('modal-overlay'));
  },
  closeModal() {
    hide(el('modal-overlay'));
    el('modal-content').innerHTML = '';
  }
};

/* ───────────────────────────────────────────
   AUTH
─────────────────────────────────────────── */
const auth = {
  currentUser: null,

  init() {
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        tab.classList.add('active');
        el(tab.dataset.tab + '-form').classList.add('active');
      });
    });

    const savedId = Store.get('currentUserId');
    if (savedId) {
      const u = auth.findUser(savedId);
      if (u) { auth.enterApp(u); return; }
    }
    hide(el('app-shell'));
    show(el('auth-screen'));
  },

  findUser(id) {
    return [...Store.get('users', []), ...Store.get('providers', [])].find(u => u.id === id) || null;
  },

  login() {
    const email = el('login-email').value.trim().toLowerCase();
    const pass = el('login-password').value;
    const errBox = el('login-error');
    const all = [...Store.get('users', []), ...Store.get('providers', [])];
    const u = all.find(x => x.email.toLowerCase() === email && x.password === pass);
    if (!u) { errBox.textContent = 'Invalid email or password.'; show(errBox); return; }
    hide(errBox);
    Store.set('currentUserId', u.id);
    auth.enterApp(u);
    toast.show(`Welcome back, ${u.name.split(' ')[0]}!`, 'success');
  },

  register() {
    const name = el('reg-name').value.trim();
    const email = el('reg-email').value.trim().toLowerCase();
    const pass = el('reg-password').value;
    const role = el('reg-role').value;
    const errBox = el('reg-error');
    if (!name || !email || pass.length < 6) {
      errBox.textContent = 'Please fill all fields. Password must be 6+ characters.'; show(errBox); return;
    }
    const all = [...Store.get('users', []), ...Store.get('providers', [])];
    if (all.some(x => x.email.toLowerCase() === email)) { errBox.textContent = 'Email already registered.'; show(errBox); return; }
    hide(errBox);

    const id = 'u' + Date.now();
    const avatar = name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
    const colors = ['#1565C0', '#00897B', '#7B1FA2', '#E53935', '#0288D1', '#F57C00'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    if (role === 'provider') {
      const newProvider = { id, name, role, email, password: pass, specialty:'elderly', specialtyLabel:'Elderly Care',
        rating:0, ratingCount:0, rate:300, available:true, lat:14.5995, lng:120.9842, bio:'New caregiver on KALINGA.', avatar, color };
      Store.update('providers', list => [...list, newProvider], []);
      Store.update('verifications', list => [...list, { provider:name, specialty:'Elderly Care', docs:'No files uploaded', status:'pending' }], []);
      Store.set('currentUserId', id);
      auth.enterApp(newProvider);
    } else {
      const newUser = { id, name, role:'client', email, password: pass, avatar, color };
      Store.update('users', list => [...list, newUser], []);
      Store.set('currentUserId', id);
      auth.enterApp(newUser);
    }
    toast.show('Account created! Welcome to KALINGA.', 'success');
  },

  logout() {
    Store.set('currentUserId', null);
    auth.currentUser = null;
    hide(el('app-shell'));
    hide(el('admin-dashboard-overlay'));
    show(el('auth-screen'));
    el('login-email').value = '';
    el('login-password').value = '';
  },

  enterApp(user) {
    auth.currentUser = user;
    hide(el('auth-screen'));
    show(el('app-shell'));

    hide(el('shell-client-badge')); hide(el('shell-provider-badge')); hide(el('shell-admin-badge'));
    hide(el('admin-dashboard-btn'));
    if (user.role === 'client') show(el('shell-client-badge'));
    if (user.role === 'provider') show(el('shell-provider-badge'));
    if (user.role === 'admin') { show(el('shell-admin-badge')); show(el('admin-dashboard-btn')); }

    pages.setupNavForRole(user.role);
    notifications.refreshBadge();
    pages.navigate('home');
  }
};

/* ───────────────────────────────────────────
   PAGES / VIEW SWITCHING
─────────────────────────────────────────── */
const pages = {
  current: 'home',

  setupNavForRole(role) {
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.onclick = () => pages.navigate(btn.dataset.page);
    });
  },

  navigate(page) {
    pages.current = page;
    document.querySelectorAll('.app-view').forEach(v => hide(v));
    document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.page === page));
    hide(el('notif-panel'));

    const role = auth.currentUser?.role;
    switch (page) {
      case 'home':
        if (role === 'provider') { show(el('view-provider-home')); providers.renderProviderHome(); }
        else { show(el('view-client-home')); requests.renderClientRequests(); }
        break;
      case 'map':
        show(el('view-map')); mapModule.render();
        break;
      case 'providers':
        show(el('view-providers')); providers.render();
        break;
      case 'bookings':
        show(el('view-bookings')); bookings.render();
        break;
      case 'chat':
        show(el('view-chat')); chatModule.renderThreads();
        break;
      case 'profile':
        show(el('view-profile')); profile.render();
        break;
      default:
        show(el('view-client-home'));
    }
  }
};

/* ───────────────────────────────────────────
   NOTIFICATIONS
─────────────────────────────────────────── */
const notifications = {
  togglePanel() {
    const panel = el('notif-panel');
    if (panel.classList.contains('hidden')) { notifications.renderList(); show(panel); }
    else hide(panel);
  },
  renderList() {
    const list = Store.get('notifications', []);
    const box = el('notif-list');
    if (!list.length) { box.innerHTML = `<div class="notif-empty">No notifications yet.</div>`; return; }
    box.innerHTML = list.map(n => `
      <div class="notif-item">
        <div class="notif-icon"><i class="fa-solid ${n.icon}"></i></div>
        <div class="notif-text">
          <p>${n.text}</p>
          <span>${n.time}</span>
        </div>
      </div>`).join('');
  },
  refreshBadge() {
    const unread = Store.get('notifications', []).filter(n => !n.read).length;
    const badge = el('notif-badge');
    if (unread > 0) { badge.textContent = unread; show(badge); } else hide(badge);
  },
  clearAll() {
    Store.update('notifications', list => list.map(n => ({ ...n, read: true })), []);
    Store.set('notifications', []);
    notifications.renderList();
    notifications.refreshBadge();
    toast.show('Notifications cleared.', 'default');
  },
  push(text, icon = 'fa-bell') {
    Store.update('notifications', list => [{ id:'n' + Date.now(), text, icon, time:'Just now', read:false }, ...list], []);
    notifications.refreshBadge();
  }
};

/* ───────────────────────────────────────────
   CLIENT — SERVICE REQUESTS
─────────────────────────────────────────── */
const requests = {
  openRequestModal() {
    const tpl = el('template-request-modal').innerHTML;
    ui.openModal(tpl);
    const dtInput = el('req-datetime');
    if (dtInput) {
      const now = new Date(Date.now() + 60 * 60000);
      const min = now.toISOString().slice(0, 16);
      dtInput.min = min;
      dtInput.value = min;
    }
  },
  submitRequest() {
    const type = el('req-type').value;
    const datetime = el('req-datetime').value;
    const duration = el('req-duration').value;
    const budget = el('req-budget').value.trim();
    const priority = el('req-priority').value;
    if (!datetime || !duration || !budget) { toast.show('Please complete all fields.', 'warning'); return; }

    const req = { id:'r' + Date.now(), clientId: auth.currentUser.id, type, datetime, duration:Number(duration), budget, priority, status:'open', providerId:null, createdAt:Date.now() };
    Store.update('requests', list => [req, ...list], []);
    ui.closeModal();
    toast.show('Service request published!', 'success');
    requests.renderClientRequests();
  },
  renderClientRequests() {
    const mine = Store.get('requests', []).filter(r => r.clientId === auth.currentUser.id);
    const box = el('client-requests-list');
    if (!mine.length) {
      box.innerHTML = `<div class="empty-state"><i class="fa-solid fa-inbox"></i><h4>No requests yet</h4><p>Create a request to get matched with caregivers.</p></div>`;
      return;
    }
    box.innerHTML = mine.map(r => `
      <div class="request-summary-item">
        <div class="rsi-main">
          <div class="rsi-title">${TYPE_LABELS[r.type] || r.type} ${r.priority === 'emergency' ? '<span class="priority-tag">Emergency</span>' : ''}</div>
          <div class="rsi-sub">${fmtDate(r.datetime)} · ${r.duration}h · ₱${r.budget}</div>
        </div>
        <span class="booking-status status-${r.status === 'open' ? 'pending' : r.status === 'matched' ? 'confirmed' : 'cancelled'}">${r.status}</span>
      </div>`).join('');
  }
};

/* ───────────────────────────────────────────
   AI MATCHING
─────────────────────────────────────────── */
const matching = {
  triggerAiMatch() {
    const provs = Store.get('providers', []).filter(p => p.available).sort((a, b) => b.rating - a.rating).slice(0, 3);
    if (!provs.length) { toast.show('No providers available right now.', 'warning'); return; }
    ui.openModal(`
      <h3><i class="fa-solid fa-wand-magic-sparkles"></i> Smart AI Matches</h3>
      <p style="font-size:13px;color:var(--text-secondary);margin:8px 0 16px;">Based on ratings, availability, and proximity, here are your top matches:</p>
      <div class="job-feed-list">
        ${provs.map(p => `
          <div class="job-feed-item">
            <div class="jfi-main">
              <div class="jfi-title">${p.name} — ${p.specialtyLabel}</div>
              <div class="jfi-sub">${starsHTML(p.rating, 11)} ${p.rating} (${p.ratingCount}) · ₱${p.rate}/hr</div>
            </div>
            <div class="pcr-actions" style="flex-direction:row;">
              <button class="btn-small" style="background:var(--success)" onclick="App.hiring.openHireModal('${p.id}')">Hire</button>
              <button class="btn-small" onclick="App.chatModule.openChat('${p.id}')">Chat</button>
            </div>
          </div>`).join('')}
      </div>`);
  }
};

/* ───────────────────────────────────────────
   HIRING — direct hire of a specific provider
─────────────────────────────────────────── */
const hiring = {
  openHireModal(providerId) {
    const p = Store.get('providers', []).find(x => x.id === providerId);
    if (!p) return;
    if (!p.available) { toast.show(`${p.name} is currently unavailable for new bookings.`, 'warning'); return; }

    const now = new Date(Date.now() + 60 * 60000);
    const minDt = now.toISOString().slice(0, 16);

    ui.openModal(`
      <h3><i class="fa-solid fa-handshake"></i> Hire ${p.name}</h3>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
        <div class="chat-avatar" style="background:${p.color}">${p.avatar}</div>
        <div>
          <div class="jfi-title">${p.name}</div>
          <div class="jfi-sub">${p.specialtyLabel} · ₱${p.rate}/hr · ${starsHTML(p.rating, 11)} ${p.rating}</div>
        </div>
      </div>
      <div class="form-group">
        <label>Date & Time</label>
        <input type="datetime-local" id="hire-datetime" min="${minDt}" value="${minDt}" />
      </div>
      <div class="grid-2-col">
        <div class="form-group">
          <label>Duration (Hours)</label>
          <input type="number" id="hire-duration" min="1" value="2" />
        </div>
        <div class="form-group">
          <label>Estimated Total (PHP)</label>
          <input type="text" id="hire-budget" value="${p.rate * 2}" />
        </div>
      </div>
      <div class="form-group">
        <label>Notes for ${p.name.split(' ')[0]}</label>
        <textarea id="hire-notes" rows="3" placeholder="Any special instructions, address details, or care needs..."></textarea>
      </div>
      <button class="btn-primary btn-full" onclick="App.hiring.confirmHire('${p.id}')">
        <i class="fa-solid fa-paper-plane"></i> Send Hire Request
      </button>
    `);

    const durationInput = el('hire-duration');
    const budgetInput = el('hire-budget');
    durationInput.oninput = () => { budgetInput.value = (p.rate * Number(durationInput.value || 1)).toFixed(0); };
  },

  confirmHire(providerId) {
    const p = Store.get('providers', []).find(x => x.id === providerId);
    const datetime = el('hire-datetime').value;
    const duration = Number(el('hire-duration').value);
    const budget = parseInt(el('hire-budget').value) || 0;
    const notes = el('hire-notes').value.trim();
    if (!p || !datetime || !duration) { toast.show('Please complete all fields.', 'warning'); return; }

    const dt = new Date(datetime);
    const booking = {
      id: 'b' + Date.now(), clientId: auth.currentUser.id, providerId: p.id, providerName: p.name,
      service: p.specialtyLabel, date: dt.toISOString().slice(0, 10), time: dt.toTimeString().slice(0, 5),
      duration, budget, status: 'pending', notes, createdAt: new Date().toISOString()
    };
    Store.update('bookings', list => [booking, ...list], []);
    notifications.push(`Your hire request to ${p.name} has been sent.`, 'fa-handshake');

    ui.closeModal();
    toast.show(`Hire request sent to ${p.name}! Awaiting confirmation.`, 'success');
    pages.navigate('bookings');
  }
};

/* ───────────────────────────────────────────
   PROVIDERS (browse / home)
─────────────────────────────────────────── */
const providers = {
  activeFilter: 'all',

  render() {
    const filter = el('filter-specialization').value || providers.activeFilter;
    const list = Store.get('providers', []).filter(p => filter === 'all' || p.specialty === filter);
    const box = el('providers-container');
    if (!list.length) {
      box.innerHTML = `<div class="empty-state"><i class="fa-solid fa-user-slash"></i><h4>No caregivers found</h4><p>Try a different specialization filter.</p></div>`;
      return;
    }
    box.innerHTML = list.map(p => `
      <div class="provider-card-row">
        <div class="chat-avatar" style="background:${p.color}">${p.avatar}</div>
        <div class="jfi-main">
          <div class="jfi-title">${p.name} <span class="avail-dot ${p.available ? 'available' : 'busy'}"></span></div>
          <div class="jfi-sub">${p.specialtyLabel} · ${starsHTML(p.rating, 11)} ${p.rating} (${p.ratingCount})</div>
          <div class="jfi-sub">₱${p.rate}/hr</div>
        </div>
        <div class="pcr-actions">
          <button class="btn-small" style="background:var(--success)" onclick="App.hiring.openHireModal('${p.id}')">Hire</button>
          <button class="btn-small" onclick="App.chatModule.openChat('${p.id}')">Chat</button>
          <button class="btn-small" style="background:var(--teal)" onclick="App.ratingModule.openProfile('${p.id}')">View</button>
        </div>
      </div>`).join('');
  },

  filter() { providers.render(); },

  renderProviderHome() {
    const me = auth.currentUser;
    const today = new Date().toISOString().slice(0, 10);
    const todays = Store.get('bookings', []).filter(b => b.providerId === me.id && b.date === today && b.status !== 'cancelled');
    const sched = el('provider-today-schedule');
    sched.innerHTML = todays.length ? todays.map(b => `
      <div class="schedule-item">
        <div class="sched-title">${b.service}</div>
        <div class="sched-sub">${b.time} · ${b.duration}h</div>
      </div>`).join('') : `<div class="empty-state"><i class="fa-solid fa-calendar"></i><h4>Nothing scheduled today</h4><p>Open postings are listed alongside.</p></div>`;

    const open = Store.get('requests', []).filter(r => r.status === 'open');
    const feed = el('provider-job-feed');
    feed.innerHTML = open.length ? open.map(r => `
      <div class="job-feed-item">
        <div class="jfi-main">
          <div class="jfi-title">${TYPE_LABELS[r.type] || r.type} ${r.priority === 'emergency' ? '<span class="priority-tag">Emergency</span>' : ''}</div>
          <div class="jfi-sub">${fmtDate(r.datetime)} · ${r.duration}h · ₱${r.budget}</div>
        </div>
        <button class="btn-small" onclick="App.providers.acceptJob('${r.id}')">Accept</button>
      </div>`).join('') : `<div class="empty-state"><i class="fa-solid fa-briefcase"></i><h4>No open postings</h4><p>Check back soon for new client requests.</p></div>`;
  },

  acceptJob(reqId) {
    const req = Store.get('requests', []).find(r => r.id === reqId);
    if (!req) return;
    const me = auth.currentUser;
    Store.update('requests', list => list.map(r => r.id === reqId ? { ...r, status:'matched', providerId: me.id } : r), []);
    const dt = new Date(req.datetime);
    const booking = {
      id:'b' + Date.now(), clientId: req.clientId, providerId: me.id, providerName: me.name,
      service: TYPE_LABELS[req.type] || req.type,
      date: dt.toISOString().slice(0, 10), time: dt.toTimeString().slice(0, 5),
      duration: req.duration, budget: parseInt(req.budget) || 0, status:'pending',
      notes:'', createdAt: new Date().toISOString()
    };
    Store.update('bookings', list => [booking, ...list], []);
    notifications.push(`${me.name} accepted a ${booking.service} request.`, 'fa-user-check');
    toast.show('Job accepted! Added to your bookings.', 'success');
    providers.renderProviderHome();
  }
};

/* ───────────────────────────────────────────
   MAP
─────────────────────────────────────────── */
const mapModule = {
  mapInstance: null,
  render() {
    if (!mapModule.mapInstance) {
      mapModule.mapInstance = L.map('leaflet-map-container').setView([14.5995, 120.9842], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(mapModule.mapInstance);
      mapModule.markersLayer = L.layerGroup().addTo(mapModule.mapInstance);
      setTimeout(() => mapModule.mapInstance.invalidateSize(), 150);
    }
    mapModule.plot(Store.get('providers', []));
    mapModule.refreshGpsBox();
  },
  refreshGpsBox() {
    const me = auth.currentUser;
    const box = el('gps-tracking-box');
    if (!box) return;
    const hasActive = me.role === 'client' && Store.get('bookings', []).some(b => b.clientId === me.id && b.status === 'confirmed');
    hasActive ? show(box) : hide(box);
  },
  plot(list) {
    mapModule.markersLayer.clearLayers();
    list.forEach(p => {
      const marker = L.marker([p.lat, p.lng]).addTo(mapModule.markersLayer);
      marker.bindPopup(`
        <div class="popup-name">${p.name}</div>
        <div class="popup-role">${p.specialtyLabel}</div>
        <div class="popup-stars">${starsHTML(p.rating, 11)} ${p.rating}</div>
        <button class="popup-btn" onclick="App.chatModule.openChat('${p.id}')">Chat</button>
      `);
    });
  },
  searchArea() {
    const q = el('map-search-input').value.trim().toLowerCase();
    if (!q) { mapModule.plot(Store.get('providers', [])); return; }
    const filtered = Store.get('providers', []).filter(p =>
      p.name.toLowerCase().includes(q) || p.specialtyLabel.toLowerCase().includes(q));
    mapModule.plot(filtered);
    toast.show(`Showing ${filtered.length} result(s) for "${q}"`, 'default');
  }
};

/* ───────────────────────────────────────────
   BOOKINGS
─────────────────────────────────────────── */
const bookings = {
  activeTab: 'upcoming',
  render() {
    document.querySelectorAll('.b-tab').forEach(t => {
      t.onclick = () => { bookings.activeTab = t.dataset.subtab; document.querySelectorAll('.b-tab').forEach(x => x.classList.remove('active')); t.classList.add('active'); bookings.renderList(); };
    });
    bookings.renderList();
  },
  renderList() {
    const me = auth.currentUser;
    let list = Store.get('bookings', []).filter(b => me.role === 'provider' ? b.providerId === me.id : b.clientId === me.id);
    list = bookings.activeTab === 'upcoming'
      ? list.filter(b => b.status === 'confirmed' || b.status === 'pending')
      : list.filter(b => b.status === 'completed' || b.status === 'cancelled');

    const box = el('bookings-content-list');
    if (!list.length) {
      box.innerHTML = `<div class="empty-state"><i class="fa-solid fa-calendar-xmark"></i><h4>Nothing here yet</h4><p>Your ${bookings.activeTab} bookings will show up here.</p></div>`;
      return;
    }
    box.innerHTML = list.map(b => `
      <div class="booking-card">
        <div class="booking-card-header">
          <strong>${b.service}</strong>
          <span class="booking-status status-${b.status}">${b.status}</span>
        </div>
        <div class="booking-info">
          <div class="booking-info-item"><i class="fa-solid fa-user-nurse"></i> ${me.role === 'provider' ? (Store.get('users', []).find(u => u.id === b.clientId)?.name || 'Client') : b.providerName}</div>
          <div class="booking-info-item"><i class="fa-solid fa-calendar"></i> ${b.date} at ${b.time}</div>
          <div class="booking-info-item"><i class="fa-solid fa-clock"></i> ${b.duration} hour(s)</div>
          <div class="booking-info-item"><i class="fa-solid fa-money-bill"></i> ₱${b.budget?.toLocaleString()}</div>
          ${b.notes ? `<div class="booking-info-item"><i class="fa-solid fa-note-sticky"></i> ${b.notes}</div>` : ''}
        </div>
        ${bookings.actionsHTML(b, me)}
      </div>`).join('');
  },
  actionsHTML(b, me) {
    if (b.status === 'pending' && me.role === 'provider') {
      return `<div class="booking-actions">
        <button class="btn-primary btn-sm" onclick="App.bookings.setStatus('${b.id}','confirmed')">Confirm</button>
        <button class="btn-danger" onclick="App.bookings.setStatus('${b.id}','cancelled')">Decline</button>
      </div>`;
    }
    if (b.status === 'confirmed') {
      return `<div class="booking-actions">
        <button class="btn-outline btn-sm" onclick="App.bookings.setStatus('${b.id}','completed')">Mark Completed</button>
        <button class="btn-danger" onclick="App.bookings.setStatus('${b.id}','cancelled')">Cancel</button>
      </div>`;
    }
    if (b.status === 'completed' && me.role === 'client') {
      return `<div class="booking-actions">
        <button class="btn-outline btn-sm" onclick="App.ratingModule.openRateModal('${b.id}')">Rate Provider</button>
      </div>`;
    }
    return '';
  },
  setStatus(id, status) {
    Store.update('bookings', list => list.map(b => b.id === id ? { ...b, status } : b), []);
    toast.show(`Booking marked as ${status}.`, status === 'cancelled' ? 'danger' : 'success');
    bookings.renderList();
  }
};

/* ───────────────────────────────────────────
   RATINGS / PROVIDER PROFILE
─────────────────────────────────────────── */
const ratingModule = {
  openProfile(providerId) {
    const p = Store.get('providers', []).find(x => x.id === providerId);
    if (!p) return;
    const reviews = Store.get('ratings', []).filter(r => r.providerId === providerId);
    ui.openModal(`
      <div style="text-align:center;margin-bottom:14px;">
        <div class="chat-avatar" style="background:${p.color};width:64px;height:64px;font-size:24px;margin:0 auto 10px;">${p.avatar}</div>
        <h3>${p.name}</h3>
        <p style="font-size:12px;color:var(--text-secondary)">${p.specialtyLabel} · ₱${p.rate}/hr</p>
      </div>
      <div class="rating-summary">
        <div class="rating-big">${p.rating}</div>
        <div class="rating-stars-wrap"><div class="stars">${starsHTML(p.rating, 14)}</div><div class="rating-count">${p.ratingCount} reviews</div></div>
      </div>
      <p style="font-size:13px;color:var(--text-secondary);margin-bottom:14px;">${p.bio}</p>
      ${reviews.map(r => `<div class="request-summary-item"><div class="rsi-main"><div class="rsi-title">${starsHTML(r.score, 11)}</div><div class="rsi-sub">${r.comment}</div></div></div>`).join('') || '<p style="font-size:12px;color:var(--text-hint)">No reviews yet.</p>'}
      <div class="grid-2-col" style="margin-top:16px;">
        <button class="btn-primary" onclick="App.hiring.openHireModal('${p.id}')"><i class="fa-solid fa-handshake"></i> Hire Now</button>
        <button class="btn-outline" onclick="App.chatModule.openChat('${p.id}')"><i class="fa-solid fa-comment"></i> Message</button>
      </div>
    `);
  },
  openRateModal(bookingId) {
    const b = Store.get('bookings', []).find(x => x.id === bookingId);
    if (!b) return;
    ui.openModal(`
      <h3>Rate ${b.providerName}</h3>
      <div class="star-rating" id="rate-stars" style="margin:16px 0;justify-content:center;">
        ${[1, 2, 3, 4, 5].map(i => `<button class="star-btn" data-val="${i}" onclick="App.ratingModule.selectStar(${i})"><i class="fa-solid fa-star"></i></button>`).join('')}
      </div>
      <div class="form-group"><label>Comment</label><textarea id="rate-comment" rows="3" placeholder="Share your experience..."></textarea></div>
      <button class="btn-primary btn-full" onclick="App.ratingModule.submitRating('${b.providerId}')">Submit Rating</button>
    `);
    ratingModule.selectedStars = 5;
    ratingModule.selectStar(5);
  },
  selectedStars: 5,
  selectStar(n) {
    ratingModule.selectedStars = n;
    document.querySelectorAll('#rate-stars .star-btn').forEach(b => b.classList.toggle('selected', Number(b.dataset.val) <= n));
  },
  submitRating(providerId) {
    const comment = el('rate-comment').value.trim() || 'No comment provided.';
    const score = ratingModule.selectedStars;
    Store.update('ratings', list => [...list, { providerId, clientId: auth.currentUser.id, score, comment, date: new Date().toISOString().slice(0, 10) }], []);
    Store.update('providers', list => list.map(p => {
      if (p.id !== providerId) return p;
      const count = p.ratingCount + 1;
      const rating = Math.round(((p.rating * p.ratingCount) + score) / count * 10) / 10;
      return { ...p, rating, ratingCount: count };
    }), []);
    ui.closeModal();
    toast.show('Thanks for your feedback!', 'success');
  }
};

/* ───────────────────────────────────────────
   CHAT
─────────────────────────────────────────── */
const chatModule = {
  activeProviderId: null,

  getKey(userId, providerId) { return `${userId}-${providerId}`; },

  renderThreads() {
    const me = auth.currentUser;
    const chats = Store.get('chats', {});
    let threadIds;
    if (me.role === 'provider') {
      threadIds = Object.keys(chats).filter(k => k.endsWith('-' + me.id)).map(k => k.split('-')[0]);
    } else {
      threadIds = Object.keys(chats).filter(k => k.startsWith(me.id + '-')).map(k => k.split('-')[1]);
    }
    const directory = me.role === 'provider' ? Store.get('users', []) : Store.get('providers', []);
    const sidebar = el('chat-threads-list');

    const contacts = threadIds.map(id => directory.find(d => d.id === id)).filter(Boolean);
    const extra = directory.filter(d => !threadIds.includes(d.id)).slice(0, 5);
    const allContacts = [...contacts, ...extra];

    if (!allContacts.length) {
      sidebar.innerHTML = `<div class="empty-state" style="padding:24px 10px;"><i class="fa-solid fa-comments"></i><p style="font-size:12px;">No contacts yet.</p></div>`;
      return;
    }
    sidebar.innerHTML = allContacts.map(c => `
      <div class="chat-thread-item ${chatModule.activeProviderId === c.id ? 'active' : ''}" onclick="App.chatModule.openChat('${c.id}')">
        <div class="chat-avatar" style="background:${c.color};width:34px;height:34px;font-size:13px;">${c.avatar}</div>
        <div class="chat-thread-name">${c.name.split(' ')[0]}</div>
      </div>`).join('');
  },

  openChat(contactId) {
    ui.closeModal();
    chatModule.activeProviderId = contactId;
    pages.navigate('chat');
    chatModule.renderThreads();

    const me = auth.currentUser;
    const contact = (me.role === 'provider' ? Store.get('users', []) : Store.get('providers', [])).find(c => c.id === contactId);
    if (!contact) return;
    const key = me.role === 'provider' ? chatModule.getKey(contactId, me.id) : chatModule.getKey(me.id, contactId);

    el('chat-target-header').textContent = contact.name + (contact.specialtyLabel ? ` · ${contact.specialtyLabel}` : '');
    chatModule.renderMessages(key);

    const input = el('chat-message-input');
    input.onkeydown = (e) => { if (e.key === 'Enter') chatModule.sendMessage(); };
  },

  renderMessages(key) {
    const msgs = Store.get('chats', {})[key] || [];
    const box = el('chat-messages-container');
    box.innerHTML = msgs.map(m => `
      <div class="msg-bubble ${m.from === auth.currentUser.id ? 'sent' : 'received'}">
        ${m.text}<div class="msg-time">${m.time}</div>
      </div>`).join('') || `<div class="empty-state" style="padding:30px;"><i class="fa-solid fa-comment-dots"></i><p>Say hello!</p></div>`;
    box.scrollTop = box.scrollHeight;
  },

  sendMessage() {
    const input = el('chat-message-input');
    const text = input.value.trim();
    if (!text || !chatModule.activeProviderId) return;
    const me = auth.currentUser;
    const key = me.role === 'provider' ? chatModule.getKey(chatModule.activeProviderId, me.id) : chatModule.getKey(me.id, chatModule.activeProviderId);
    const time = new Date().toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit' });
    Store.update('chats', chats => { chats[key] = [...(chats[key] || []), { from: me.id, text, time }]; return chats; }, {});
    input.value = '';
    chatModule.renderMessages(key);

    if (me.role === 'client') {
      setTimeout(() => {
        Store.update('chats', chats => { chats[key] = [...(chats[key] || []), { from: chatModule.activeProviderId, text:"Thanks for the message! I'll get back to you shortly.", time: new Date().toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit' }) }]; return chats; }, {});
        if (pages.current === 'chat') chatModule.renderMessages(key);
      }, 1200);
    }
  }
};

/* ───────────────────────────────────────────
   AI CHATBOT WIDGET
─────────────────────────────────────────── */
const chatbot = {
  open: false,
  toggleWidget() {
    chatbot.open = !chatbot.open;
    chatbot.open ? show(el('ai-chatbot-panel')) : hide(el('ai-chatbot-panel'));
  },
  sendMessage() {
    const input = el('chatbot-input');
    const text = input.value.trim();
    if (!text) return;
    chatbot.appendMsg(text, 'user-msg');
    input.value = '';
    setTimeout(() => chatbot.appendMsg(chatbot.reply(text), 'bot-msg'), 500);
  },
  appendMsg(text, cls) {
    const box = el('chatbot-messages');
    const node = document.createElement('div');
    node.className = cls;
    node.textContent = text;
    box.appendChild(node);
    box.scrollTop = box.scrollHeight;
  },
  reply(text) {
    const t = text.toLowerCase();
    if (t.includes('book')) return "To book a caregiver, go to the Providers tab, choose someone available, then start a chat to arrange details — or post a request from Home and let providers come to you!";
    if (t.includes('price') || t.includes('rate') || t.includes('cost')) return 'Caregiver rates typically range from ₱300–₱600/hr depending on specialty and experience. Each provider lists their own rate on their profile.';
    if (t.includes('rating') || t.includes('review')) return 'You can rate a provider after a completed booking from the Bookings > Hiring History tab.';
    if (t.includes('cancel')) return 'You can cancel a confirmed booking from the Bookings tab — just open the booking and tap Cancel.';
    if (t.includes('complain') || t.includes('issue') || t.includes('problem')) return "I'm sorry to hear that. Please describe the issue here and our support team will review it, or escalate it via your booking details.";
    if (t.includes('emergency')) return 'For urgent care needs, post a request and select "EMERGENCY" priority — this notifies available providers immediately.';
    return "I can help with bookings, pricing, ratings, cancellations, and complaints. Could you tell me a bit more about what you need?";
  }
};

/* ───────────────────────────────────────────
   ADMIN
─────────────────────────────────────────── */
const admin = {
  open: false,
  toggleDashboard() {
    admin.open = !admin.open;
    if (admin.open) { admin.render(); show(el('admin-dashboard-overlay')); }
    else hide(el('admin-dashboard-overlay'));
  },
  render() {
    el('admin-stat-clients').textContent = Store.get('users', []).filter(u => u.role === 'client').length;
    el('admin-stat-providers').textContent = Store.get('providers', []).filter(p => p.available).length;
    const flags = Store.get('complaints', []).filter(c => c.status === 'open').length;
    el('admin-stat-flags').textContent = `${flags} Pending`;
    el('admin-stat-flags').className = flags > 0 ? 'text-danger' : '';

    el('admin-verification-table').innerHTML = Store.get('verifications', []).map((v, i) => `
      <tr>
        <td>${v.provider}</td>
        <td>${v.specialty}</td>
        <td>${v.docs}</td>
        <td>${v.status === 'pending'
          ? `<button class="admin-action-btn approve" onclick="App.admin.approveVerification(${i})">Approve</button>`
          : `<span class="booking-status status-confirmed">Approved</span>`}</td>
      </tr>`).join('') || '<tr><td colspan="4">No pending verifications.</td></tr>';

    el('admin-complaints-table').innerHTML = Store.get('complaints', []).map((c, i) => `
      <tr>
        <td>${c.bookingId}</td>
        <td>${c.issue}</td>
        <td><span class="booking-status ${c.severity === 'high' ? 'status-cancelled' : 'status-pending'}">${c.severity}</span></td>
        <td>${c.status === 'open'
          ? `<button class="admin-action-btn resolve" onclick="App.admin.resolveComplaint(${i})">Resolve</button>`
          : `<span class="booking-status status-confirmed">Resolved</span>`}</td>
      </tr>`).join('') || '<tr><td colspan="4">No active complaints.</td></tr>';
  },
  approveVerification(i) {
    Store.update('verifications', list => { list[i].status = 'approved'; return list; }, []);
    toast.show('Provider verified.', 'success');
    admin.render();
  },
  resolveComplaint(i) {
    Store.update('complaints', list => { list[i].status = 'resolved'; return list; }, []);
    toast.show('Complaint resolved.', 'success');
    admin.render();
  }
};

/* ───────────────────────────────────────────
   PROFILE
─────────────────────────────────────────── */
const profile = {
  render() {
    const u = auth.currentUser;
    const isProvider = u.role === 'provider';
    const myBookingsCount = Store.get('bookings', []).filter(b => isProvider ? b.providerId === u.id : b.clientId === u.id).length;

    el('profile-management-view').innerHTML = `
      <div class="profile-hero">
        <div class="profile-avatar-lg" style="background:${u.color}">${u.avatar}</div>
        <h3>${u.name}</h3>
        <span>${u.email}</span>
        <div class="profile-role-badge">${u.role.toUpperCase()}</div>
      </div>

      <div class="menu-list">
        <div class="menu-item">
          <div class="menu-icon" style="background:#E3F2FD;color:#1565C0"><i class="fa-solid fa-calendar-check"></i></div>
          <span>${myBookingsCount} Total Bookings</span>
        </div>
        ${isProvider ? `
        <div class="menu-item">
          <div class="menu-icon" style="background:#FFF8E1;color:#F57C00"><i class="fa-solid fa-star"></i></div>
          <span>${u.rating || 0} Rating (${u.ratingCount || 0} reviews)</span>
        </div>` : ''}
      </div>

      <div class="menu-list">
        <div class="menu-item" onclick="App.profile.editProfile()">
          <div class="menu-icon" style="background:#E8EAF6;color:#3949AB"><i class="fa-solid fa-pen"></i></div>
          <span>Edit Profile</span><i class="fa-solid fa-chevron-right"></i>
        </div>
        <div class="menu-item" onclick="App.profile.notificationSettings()">
          <div class="menu-icon" style="background:#E0F2F1;color:#00897B"><i class="fa-solid fa-bell"></i></div>
          <span>Notification Settings</span><i class="fa-solid fa-chevron-right"></i>
        </div>
        <div class="menu-item" onclick="App.profile.privacyPolicy()">
          <div class="menu-icon" style="background:#E8F5E9;color:#2E7D32"><i class="fa-solid fa-shield-halved"></i></div>
          <span>Privacy Policy</span><i class="fa-solid fa-chevron-right"></i>
        </div>
      </div>

      ${u.role === 'admin' ? `
      <div class="menu-list">
        <div class="menu-item" onclick="App.admin.toggleDashboard()">
          <div class="menu-icon" style="background:#FCE4EC;color:#C62828"><i class="fa-solid fa-gauge"></i></div>
          <span>Admin Dashboard</span><i class="fa-solid fa-chevron-right"></i>
        </div>
      </div>` : ''}

      <button class="btn-danger btn-full" style="margin-top:20px;width:100%;padding:13px;" onclick="App.auth.logout()">
        <i class="fa-solid fa-right-from-bracket"></i> Logout
      </button>
      <p style="text-align:center;font-size:11px;color:var(--text-hint);margin-top:12px;">KALINGA v1.0 · Data stored locally</p>
    `;
  },

  editProfile() {
    const u = auth.currentUser;
    const isProvider = u.role === 'provider';
    const colors = ['#1565C0', '#00897B', '#7B1FA2', '#E53935', '#0288D1', '#F57C00', '#388E3C', '#3949AB'];

    ui.openModal(`
      <h3><i class="fa-solid fa-pen"></i> Edit Profile</h3>
      <div class="form-group">
        <label>Full Name</label>
        <input type="text" id="edit-name" value="${u.name}" />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="edit-email" value="${u.email}" />
      </div>
      ${isProvider ? `
      <div class="form-group">
        <label>Specialization</label>
        <select id="edit-specialty">
          ${Object.entries(TYPE_LABELS).map(([val, label]) => `<option value="${val}" ${u.specialty === val ? 'selected' : ''}>${label}</option>`).join('')}
        </select>
      </div>
      <div class="grid-2-col">
        <div class="form-group">
          <label>Hourly Rate (₱)</label>
          <input type="number" id="edit-rate" min="100" value="${u.rate}" />
        </div>
        <div class="form-group">
          <label>Availability</label>
          <select id="edit-available">
            <option value="true" ${u.available ? 'selected' : ''}>Available</option>
            <option value="false" ${!u.available ? 'selected' : ''}>Unavailable</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label>Bio</label>
        <textarea id="edit-bio" rows="3">${u.bio || ''}</textarea>
      </div>` : ''}
      <div class="form-group">
        <label>Avatar Color</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${colors.map(c => `<div onclick="App.profile.pickColor('${c}')" data-color="${c}" class="avatar-swatch ${u.color === c ? 'selected' : ''}" style="width:30px;height:30px;border-radius:50%;background:${c};cursor:pointer;border:3px solid ${u.color === c ? '#1A1A2E' : 'transparent'};"></div>`).join('')}
        </div>
      </div>
      <div class="form-group">
        <label>New Password <span style="text-transform:none;font-weight:400;">(optional)</span></label>
        <input type="password" id="edit-password" placeholder="Leave blank to keep current password" />
      </div>
      <div class="form-error hidden" id="edit-profile-error"></div>
      <button class="btn-primary btn-full" onclick="App.profile.saveProfile()"><i class="fa-solid fa-floppy-disk"></i> Save Changes</button>
    `);
    profile.selectedColor = u.color;
  },

  selectedColor: null,
  pickColor(c) {
    profile.selectedColor = c;
    document.querySelectorAll('.avatar-swatch').forEach(sw => {
      sw.style.border = sw.dataset.color === c ? '3px solid #1A1A2E' : '3px solid transparent';
    });
  },

  saveProfile() {
    const u = auth.currentUser;
    const isProvider = u.role === 'provider';
    const name = el('edit-name').value.trim();
    const email = el('edit-email').value.trim().toLowerCase();
    const password = el('edit-password').value;
    const errBox = el('edit-profile-error');

    if (!name || !email) { errBox.textContent = 'Name and email are required.'; show(errBox); return; }
    const all = [...Store.get('users', []), ...Store.get('providers', [])];
    if (all.some(x => x.id !== u.id && x.email.toLowerCase() === email)) {
      errBox.textContent = 'That email is already in use by another account.'; show(errBox); return;
    }
    if (password && password.length < 6) { errBox.textContent = 'New password must be 6+ characters.'; show(errBox); return; }
    hide(errBox);

    const updates = { name, email, color: profile.selectedColor || u.color };
    if (password) updates.password = password;
    if (isProvider) {
      updates.specialty = el('edit-specialty').value;
      updates.specialtyLabel = TYPE_LABELS[updates.specialty] || updates.specialty;
      updates.rate = Number(el('edit-rate').value) || u.rate;
      updates.available = el('edit-available').value === 'true';
      updates.bio = el('edit-bio').value.trim();
    }

    const storeKey = isProvider ? 'providers' : 'users';
    Store.update(storeKey, list => list.map(x => x.id === u.id ? { ...x, ...updates } : x), []);
    auth.currentUser = { ...u, ...updates };
    Store.set('currentUserId', u.id);

    ui.closeModal();
    toast.show('Profile updated successfully!', 'success');
    profile.render();
  },

  notificationSettings() {
    const prefs = Store.get('notifPrefs', { bookings: true, messages: true, promos: false });
    ui.openModal(`
      <h3><i class="fa-solid fa-bell"></i> Notification Settings</h3>
      <div class="menu-list">
        <label class="menu-item" style="cursor:pointer;">
          <div class="menu-icon" style="background:#E3F2FD;color:#1565C0"><i class="fa-solid fa-calendar-check"></i></div>
          <span>Booking Updates</span>
          <input type="checkbox" id="pref-bookings" ${prefs.bookings ? 'checked' : ''} style="width:18px;height:18px;" />
        </label>
        <label class="menu-item" style="cursor:pointer;">
          <div class="menu-icon" style="background:#E0F2F1;color:#00897B"><i class="fa-solid fa-comments"></i></div>
          <span>New Messages</span>
          <input type="checkbox" id="pref-messages" ${prefs.messages ? 'checked' : ''} style="width:18px;height:18px;" />
        </label>
        <label class="menu-item" style="cursor:pointer;">
          <div class="menu-icon" style="background:#FFF8E1;color:#F57C00"><i class="fa-solid fa-tag"></i></div>
          <span>Promotions & Tips</span>
          <input type="checkbox" id="pref-promos" ${prefs.promos ? 'checked' : ''} style="width:18px;height:18px;" />
        </label>
      </div>
      <button class="btn-primary btn-full" onclick="App.profile.saveNotifPrefs()"><i class="fa-solid fa-floppy-disk"></i> Save Preferences</button>
    `);
  },

  saveNotifPrefs() {
    const prefs = {
      bookings: el('pref-bookings').checked,
      messages: el('pref-messages').checked,
      promos: el('pref-promos').checked
    };
    Store.set('notifPrefs', prefs);
    ui.closeModal();
    toast.show('Notification preferences saved.', 'success');
  },

  privacyPolicy() {
    ui.openModal(`
      <h3><i class="fa-solid fa-shield-halved"></i> Privacy Policy</h3>
      <p style="font-size:13px;color:var(--text-secondary);line-height:1.7;">
        KALINGA stores your account, booking, and chat data locally in your browser for this prototype demo —
        nothing is transmitted to an external server. Clearing your browser storage will remove all data.
        In a production deployment, this section would describe how personal and health-related information
        is collected, stored securely, and used strictly to match clients with caregivers.
      </p>
      <button class="btn-outline btn-full" style="margin-top:16px;" onclick="App.ui.closeModal()">Close</button>
    `);
  }
};

/* ───────────────────────────────────────────
   GLOBAL CLICK HANDLERS / INIT
─────────────────────────────────────────── */
function bindGlobalUI() {
  el('modal-overlay').addEventListener('click', e => { if (e.target === el('modal-overlay')) ui.closeModal(); });

  document.addEventListener('click', e => {
    const panel = el('notif-panel');
    const btn = el('notif-btn');
    if (panel && !panel.classList.contains('hidden') && !panel.contains(e.target) && !btn.contains(e.target)) hide(panel);
  });
}

function init() {
  initSeed();
  bindGlobalUI();

  setTimeout(() => { const splash = el('splash-screen'); if (splash) splash.style.display = 'none'; }, 2900);

  auth.init();
}

init();

/* ───────────────────────────────────────────
   PUBLIC API (used by inline onclick handlers)
─────────────────────────────────────────── */
return { auth, ui, pages, toast, notifications, requests, matching, hiring, providers, mapModule, map: mapModule, bookings, ratingModule, chatModule, chat: chatModule, chatbot, admin, profile };

})(); // end App IIFE
