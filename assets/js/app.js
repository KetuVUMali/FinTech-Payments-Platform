/* ==========================================================================
   FinTech Payments Platform — Master Shared Logic (Vanilla ES6+)
   ========================================================================== */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const ROOT = document.body.dataset.root || '';

/* Currency Management */
const CURRENCIES = {
  INR: { symbol: '₹', rate: 1, locale: 'en-IN' },
  USD: { symbol: '$', rate: 0.012, locale: 'en-US' },
  EUR: { symbol: '€', rate: 0.011, locale: 'de-DE' },
  GBP: { symbol: '£', rate: 0.0095, locale: 'en-GB' }
};
function getCurrency() { return localStorage.getItem('fintech-curr') || 'INR'; }
function setCurrency(c) {
  if (!CURRENCIES[c]) return;
  localStorage.setItem('fintech-curr', c);
  document.querySelectorAll('.curr-symbol').forEach(el => el.textContent = CURRENCIES[c].symbol);
  document.dispatchEvent(new CustomEvent('currencychange', { detail: c }));
  showToast(`Currency set to ${c} (${CURRENCIES[c].symbol})`);
}
const fmt = (n, curr = getCurrency()) => {
  const conf = CURRENCIES[curr] || CURRENCIES.INR;
  const converted = Math.round(n * (curr === 'INR' ? 1 : conf.rate));
  return conf.symbol + converted.toLocaleString(conf.locale);
};

/* Theme System */
const THEMES = ['dark', 'light', 'midnight', 'contrast'];
const THEME_LABELS = { dark: 'Dark Obsidian', light: 'Light Crystal', midnight: 'Midnight Sapphire', contrast: 'High Contrast' };
const THEME_COLORS = { dark: '#3b82f6', light: '#2563eb', midnight: '#6366f1', contrast: '#ffd400' };

function setTheme(t) {
  if (!THEMES.includes(t)) t = 'dark';
  document.documentElement.dataset.theme = t;
  document.documentElement.dataset.bsTheme = t === 'light' ? 'light' : 'dark';
  localStorage.setItem('fintech-theme', t);
  document.dispatchEvent(new Event('themechange'));
}

/* Toast Notifications */
function showToast(msg, type = 'success') {
  let c = $('#toasts');
  if (!c) {
    c = document.createElement('div');
    c.id = 'toasts';
    c.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    c.style.zIndex = '1090';
    document.body.append(c);
  }
  const e = document.createElement('div');
  e.className = `toast align-items-center text-bg-${type} border-0 shadow-lg`;
  e.setAttribute('role', 'status');
  e.innerHTML = `<div class="d-flex"><div class="toast-body d-flex align-items-center gap-2"><i class="bi bi-${type === 'success' ? 'check-circle-fill' : type === 'warning' ? 'exclamation-triangle-fill' : 'info-circle-fill'}"></i> <span>${msg}</span></div><button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div>`;
  c.append(e);
  new bootstrap.Toast(e, { delay: 3000 }).show();
  e.addEventListener('hidden.bs.toast', () => e.remove());
}

const copyToClipboard = (t, label = 'Copied to clipboard') => navigator.clipboard.writeText(t).then(() => showToast(label));

/* Dropdown Builders */
const themeMenu = () => THEMES.map(t => `
  <li><button class="dropdown-item d-flex align-items-center justify-content-between py-2" onclick="setTheme('${t}')">
    <span class="d-flex align-items-center gap-2">
      <span style="width:10px;height:10px;border-radius:50%;background:${THEME_COLORS[t]};display:inline-block"></span>
      ${THEME_LABELS[t]}
    </span>
    ${document.documentElement.dataset.theme === t ? '<i class="bi bi-check text-primary fw-bold"></i>' : ''}
  </button></li>`).join('');

const currencyMenu = () => Object.entries(CURRENCIES).map(([k, v]) => `
  <li><button class="dropdown-item d-flex align-items-center justify-content-between py-2" onclick="setCurrency('${k}')">
    <span><b>${v.symbol}</b> ${k}</span>
    ${getCurrency() === k ? '<i class="bi bi-check text-primary fw-bold"></i>' : ''}
  </button></li>`).join('');

/* ==========================================================================
   Public Layout: Announcement Bar + Shining Glass Navbar + Enterprise Footer
   ========================================================================== */
function publicLayout() {
  const currentTheme = document.documentElement.dataset.theme || 'dark';
  const currentCurr = getCurrency();
  const themeIcons = {
    dark: 'bi-moon-stars-fill text-info',
    light: 'bi-sun-fill text-warning',
    midnight: 'bi-stars text-primary',
    contrast: 'bi-circle-half text-warning'
  };
  const activeThemeIcon = themeIcons[currentTheme] || 'bi-palette text-primary';
  const activeThemeLabel = THEME_LABELS[currentTheme] || 'Dark Obsidian';

  // Top Announcement Bar & Sticky Glass Navbar
  $('#nav').innerHTML = `
  <div class="announcement-bar py-2">
    <div class="container d-flex align-items-center justify-content-between flex-wrap gap-2">
      <div class="d-flex align-items-center gap-2 flex-wrap">
        <span class="badge-live"><span class="pulse-dot"></span> v3.2 ACTIVE</span>
        <span class="small">Next-Gen UPI 2.0 & Autonomous Payout Engine Active &middot; Sub-110ms settlement latency.</span>
      </div>
      <div class="d-flex align-items-center gap-3 ms-auto">
        <a class="text-white text-decoration-underline fw-semibold small" href="#pricing">Explore Transparent 1.7% Rates →</a>
        <button class="btn btn-sm text-white-50 p-0 border-0 ms-2" onclick="this.closest('.announcement-bar').remove()" aria-label="Close Announcement"><i class="bi bi-x-lg"></i></button>
      </div>
    </div>
  </div>

  <nav class="navbar navbar-expand-lg fintech-navbar py-2.5">
    <div class="container">
      <!-- Brand Logo -->
      <a class="fintech-brand" href="${ROOT}index.html">
        <div class="brand-icon-box">
          <i class="bi bi-shield-check"></i>
        </div>
        <div class="d-flex align-items-center">
          <span class="brand-title">FinTech<span>Payments</span></span>
          <span class="brand-tag d-none d-sm-inline-block">Enterprise</span>
        </div>
      </a>

      <!-- Mobile Toggle Button -->
      <button class="navbar-toggler border-0 p-2 shadow-none rounded-3" type="button" data-bs-toggle="collapse" data-bs-target="#pn" aria-label="Toggle navigation" style="background: rgba(255,255,255,0.06);">
        <i class="bi bi-list fs-2 text-body"></i>
      </button>

      <!-- Navbar Collapsible Menu -->
      <div id="pn" class="collapse navbar-collapse">
        <ul class="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-1">
          <!-- 1. Products Dropdown -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Products
            </a>
            <div class="dropdown-menu fintech-dropdown p-3" style="min-width: 540px; max-width: 95vw;">
              <div class="px-2 pb-2 mb-1 border-bottom d-flex align-items-center justify-content-between">
                <span class="small text-uppercase fw-bold text-muted" style="letter-spacing:0.5px;">Core Products</span>
                <span class="badge rounded-pill bg-success-subtle text-success small">6 Modules</span>
              </div>
              <div class="mega-menu-grid">
                <a class="mega-dropdown-item" href="#products">
                  <div class="mega-item-icon"><i class="bi bi-credit-card-2-front"></i></div>
                  <div>
                    <div class="mega-item-title">Global Payments</div>
                    <span class="mega-item-desc">Cards, UPI 2.0 & 135+ Currencies</span>
                  </div>
                </a>
                <a class="mega-dropdown-item" href="#products">
                  <div class="mega-item-icon"><i class="bi bi-send-check"></i></div>
                  <div>
                    <div class="mega-item-title">Instant Payouts</div>
                    <span class="mega-item-desc">Sub-3s automated vendor payouts</span>
                  </div>
                </a>
                <a class="mega-dropdown-item" href="#products">
                  <div class="mega-item-icon"><i class="bi bi-link-45deg"></i></div>
                  <div>
                    <div class="mega-item-title">Payment Links & QR</div>
                    <span class="mega-item-desc">No-code branded payment links</span>
                  </div>
                </a>
                <a class="mega-dropdown-item" href="#products">
                  <div class="mega-item-icon"><i class="bi bi-receipt-cutoff"></i></div>
                  <div>
                    <div class="mega-item-title">Smart Invoicing</div>
                    <span class="mega-item-desc">GST-compliant B2B e-invoicing</span>
                  </div>
                </a>
                <a class="mega-dropdown-item" href="#products">
                  <div class="mega-item-icon"><i class="bi bi-arrow-repeat"></i></div>
                  <div>
                    <div class="mega-item-title">Subscriptions</div>
                    <span class="mega-item-desc">Recurring billing & dunning recovery</span>
                  </div>
                </a>
                <a class="mega-dropdown-item" href="#methods">
                  <div class="mega-item-icon"><i class="bi bi-grid-3x3-gap-fill"></i></div>
                  <div>
                    <div class="mega-item-title">Payment Rails Matrix</div>
                    <span class="mega-item-desc">100+ global methods filtered</span>
                  </div>
                </a>
              </div>
              <div class="mega-menu-footer">
                <span class="text-muted small"><i class="bi bi-cpu me-1 text-primary"></i> Sub-110ms settlement</span>
                <a class="text-primary fw-semibold small text-decoration-none" href="#calculator">Fee Savings Calculator →</a>
              </div>
            </div>
          </li>

          <!-- 2. Solutions Dropdown -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Solutions
            </a>
            <ul class="dropdown-menu fintech-dropdown p-2" style="min-width: 270px;">
              <li><a class="dropdown-item py-2 d-flex align-items-center gap-2" href="#solutions">
                <span class="icon-tile" style="width:32px;height:32px;font-size:0.95rem;"><i class="bi bi-shop"></i></span>
                <div><div class="fw-semibold small">E-Commerce & Retail</div><div class="text-muted" style="font-size:0.75rem;">1-Click checkout & UPI conversion</div></div>
              </a></li>
              <li><a class="dropdown-item py-2 d-flex align-items-center gap-2" href="#solutions">
                <span class="icon-tile" style="width:32px;height:32px;font-size:0.95rem;"><i class="bi bi-clouds"></i></span>
                <div><div class="fw-semibold small">SaaS & Subscriptions</div><div class="text-muted" style="font-size:0.75rem;">Global multi-currency billing</div></div>
              </a></li>
              <li><a class="dropdown-item py-2 d-flex align-items-center gap-2" href="#solutions">
                <span class="icon-tile" style="width:32px;height:32px;font-size:0.95rem;"><i class="bi bi-diagram-3"></i></span>
                <div><div class="fw-semibold small">Marketplaces</div><div class="text-muted" style="font-size:0.75rem;">Automated multi-party split payouts</div></div>
              </a></li>
              <li><a class="dropdown-item py-2 d-flex align-items-center gap-2" href="#solutions">
                <span class="icon-tile" style="width:32px;height:32px;font-size:0.95rem;"><i class="bi bi-globe2"></i></span>
                <div><div class="fw-semibold small">Global Cross-Border</div><div class="text-muted" style="font-size:0.75rem;">Treasury & SWIFT/SEPA rails</div></div>
              </a></li>
            </ul>
          </li>

          <!-- 3. Direct Links (Clean & Essential) -->
          <li class="nav-item"><a class="nav-link" href="#pricing">Pricing</a></li>
          <li class="nav-item"><a class="nav-link" href="#developers">Developers</a></li>
        </ul>

        <!-- Mobile Drawer Utilities (Visible on Mobile only) -->
        <div class="d-lg-none mobile-controls-row">
          <div class="dropdown">
            <button class="btn btn-sm btn-nav-control dropdown-toggle d-flex align-items-center gap-1.5" data-bs-toggle="dropdown">
              <span class="curr-symbol fw-bold text-primary">${CURRENCIES[currentCurr].symbol}</span>
              <span class="small fw-semibold">${currentCurr}</span>
            </button>
            <ul class="dropdown-menu fintech-dropdown">${currencyMenu()}</ul>
          </div>

          <div class="dropdown">
            <button class="btn btn-sm btn-nav-control dropdown-toggle d-flex align-items-center gap-1.5" data-bs-toggle="dropdown">
              <i class="bi ${activeThemeIcon}"></i>
              <span class="small fw-semibold">${activeThemeLabel.split(' ')[0]}</span>
            </button>
            <ul class="dropdown-menu fintech-dropdown dropdown-menu-end">${themeMenu()}</ul>
          </div>
        </div>

        <!-- Mobile Drawer Actions (Visible on Mobile only) -->
        <div class="d-lg-none mobile-actions-row">
          <a class="btn-nav-cta" href="${ROOT}signup.html">
            <span>Start Free</span>
            <i class="bi bi-arrow-right"></i>
          </a>
          <a class="btn-nav-login" href="${ROOT}login.html">Sign In</a>
        </div>

        <!-- Desktop Action Controls (Visible on Large screens only) -->
        <div class="d-none d-lg-flex align-items-center gap-2">
          <!-- Currency Selector -->
          <div class="dropdown">
            <button class="btn btn-sm btn-nav-control dropdown-toggle d-flex align-items-center gap-1.5 px-2.5 py-1.5" data-bs-toggle="dropdown" aria-label="Select Currency">
              <span class="curr-symbol fw-bold text-primary">${CURRENCIES[currentCurr].symbol}</span>
              <span class="fw-semibold small">${currentCurr}</span>
            </button>
            <ul class="dropdown-menu fintech-dropdown dropdown-menu-end">${currencyMenu()}</ul>
          </div>

          <!-- Theme Selector (Compact Icon) -->
          <div class="dropdown">
            <button class="btn btn-sm btn-nav-control d-flex align-items-center justify-content-center p-2 rounded-circle" style="width: 35px; height: 35px;" data-bs-toggle="dropdown" aria-label="Toggle Theme" title="Theme: ${activeThemeLabel}">
              <i class="bi ${activeThemeIcon}"></i>
            </button>
            <ul class="dropdown-menu fintech-dropdown dropdown-menu-end">${themeMenu()}</ul>
          </div>

          <!-- Divider -->
          <div class="vr opacity-25 mx-1" style="height: 22px;"></div>

          <!-- Sign In & Start Free CTAs -->
          <a class="btn-nav-login" href="${ROOT}login.html">Sign In</a>
          <a class="btn-nav-cta" href="${ROOT}signup.html">
            <span>Start Free</span>
            <i class="bi bi-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  </nav>`;

  // Auto-close mobile navbar drawer when anchor links are clicked
  $$('.fintech-navbar .nav-link:not(.dropdown-toggle), .fintech-navbar .dropdown-item, .fintech-navbar .mega-dropdown-item').forEach(el => {
    el.addEventListener('click', () => {
      const pn = $('#pn');
      if (pn && pn.classList.contains('show') && window.bootstrap) {
        const bsCollapse = bootstrap.Collapse.getInstance(pn) || new bootstrap.Collapse(pn);
        bsCollapse.hide();
      }
    });
  });

  // Enterprise Multi-Column Footer
  $('#foot').innerHTML = `
  <footer class="border-top pt-5 pb-4 mt-5 position-relative" style="background: var(--glass-bg-subtle);">
    <div class="container">
      <div class="row g-4 mb-5">
        <div class="col-lg-4">
          <a class="d-flex align-items-center gap-2 fw-bold fs-4 text-decoration-none mb-3" href="${ROOT}index.html">
            <span class="feature-icon-prism" style="width:34px;height:34px;font-size:1.1rem;border-radius:8px;"><i class="bi bi-shield-check"></i></span>
            <span class="text-body fw-bold">FinTech<span class="prism-text-gradient">Payments</span></span>
          </a>
          <p class="text-muted small pe-lg-4">
            Unified payment infrastructure engineered for modern internet commerce. Accept global payments, automate instant multi-party payouts, prevent fraud, and accelerate financial velocity.
          </p>
          <div class="d-flex gap-2 align-items-center mt-3 flex-wrap">
            <span class="prism-badge text-success"><span class="pulse-dot"></span> All Systems Operational</span>
            <span class="badge border text-muted">99.999% SLA</span>
          </div>
        </div>

        <div class="col-6 col-sm-3 col-lg-2">
          <h6 class="fw-bold mb-3">Products</h6>
          <ul class="list-unstyled small text-muted d-flex flex-column gap-2 mb-0">
            <li><a class="text-decoration-none text-muted" href="#products">Payment Gateway</a></li>
            <li><a class="text-decoration-none text-muted" href="#products">Autonomous Payouts</a></li>
            <li><a class="text-decoration-none text-muted" href="#products">Payment Links</a></li>
            <li><a class="text-decoration-none text-muted" href="#products">Smart Invoicing</a></li>
            <li><a class="text-decoration-none text-muted" href="#products">Subscriptions</a></li>
            <li><a class="text-decoration-none text-muted" href="#products">AI Fraud Shield</a></li>
          </ul>
        </div>

        <div class="col-6 col-sm-3 col-lg-2">
          <h6 class="fw-bold mb-3">Developers</h6>
          <ul class="list-unstyled small text-muted d-flex flex-column gap-2 mb-0">
            <li><a class="text-decoration-none text-muted" href="#developers">API Documentation</a></li>
            <li><a class="text-decoration-none text-muted" href="${ROOT}dashboard/api-keys.html">API Keys</a></li>
            <li><a class="text-decoration-none text-muted" href="${ROOT}dashboard/webhooks.html">Webhooks</a></li>
            <li><a class="text-decoration-none text-muted" href="#developers">SDK Libraries</a></li>
            <li><a class="text-decoration-none text-muted" href="${ROOT}dashboard/index.html">Sandbox Test Mode</a></li>
            <li><a class="text-decoration-none text-muted" href="${ROOT}dashboard/audit-logs.html">System Logs</a></li>
          </ul>
        </div>

        <div class="col-6 col-sm-3 col-lg-2">
          <h6 class="fw-bold mb-3">Company</h6>
          <ul class="list-unstyled small text-muted d-flex flex-column gap-2 mb-0">
            <li><a class="text-decoration-none text-muted" href="#pricing">Pricing Plans</a></li>
            <li><a class="text-decoration-none text-muted" href="#pricing">Enterprise</a></li>
            <li><a class="text-decoration-none text-muted" href="${ROOT}dashboard/customers.html">Customer Stories</a></li>
            <li><a class="text-decoration-none text-muted" href="${ROOT}dashboard/team.html">Careers & Team</a></li>
            <li><a class="text-decoration-none text-muted" href="${ROOT}login.html">Merchant Portal</a></li>
          </ul>
        </div>

        <div class="col-6 col-sm-3 col-lg-2">
          <h6 class="fw-bold mb-3">Security & Legal</h6>
          <ul class="list-unstyled small text-muted d-flex flex-column gap-2 mb-0">
            <li><a class="text-decoration-none text-muted" href="#security">PCI-DSS Level 1</a></li>
            <li><a class="text-decoration-none text-muted" href="#security">ISO 27001 Certified</a></li>
            <li><a class="text-decoration-none text-muted" href="#security">RBI Compliance</a></li>
            <li><a class="text-decoration-none text-muted" href="${ROOT}pricing.html">Terms of Service</a></li>
            <li><a class="text-decoration-none text-muted" href="${ROOT}pricing.html">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      <div class="d-flex flex-column flex-md-row justify-content-between align-items-center pt-4 border-top small text-muted gap-3">
        <p class="mb-0">© 2026 FinTech Payments Platform, Inc. All rights reserved. Regulated under authorized payment aggregator framework.</p>
        <div class="d-flex gap-3 fs-6">
          <a href="https://github.com" target="_blank" class="text-muted text-decoration-none" aria-label="GitHub"><i class="bi bi-github"></i></a>
          <a href="https://twitter.com" target="_blank" class="text-muted text-decoration-none" aria-label="Twitter"><i class="bi bi-twitter-x"></i></a>
          <a href="https://linkedin.com" target="_blank" class="text-muted text-decoration-none" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a>
          <a href="https://discord.com" target="_blank" class="text-muted text-decoration-none" aria-label="Discord"><i class="bi bi-discord"></i></a>
        </div>
      </div>
    </div>
  </footer>`;

  initAOS();
  initIndexPage();
}

/* ==========================================================================
   AOS (Animate On Scroll) Engine Integration
   ========================================================================== */
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 750,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
      disableMutationObserver: false
    });
    setTimeout(() => {
      if (typeof AOS !== 'undefined') AOS.refresh();
    }, 150);
  }
}

/* ==========================================================================
   Index Page Interactive Engine (Prism Hero, Code Playground, Calculator)
   ========================================================================== */
function initIndexPage() {
  if (!$('#heroRevenueChart')) return;

  // 1. Draw Hero Interactive Sparkline Chart
  drawIndexHeroChart();

  // 2. Draw Analytics Doughnut Chart
  drawAnalyticsMethodChart();

  // 3. Interactive Fee & Savings Calculator
  initSavingsCalculator();

  // 4. Developer Playground Code Switcher & Simulation
  initCodePlayground();

  // 5. Payment Method Tab Filtering
  initMethodFilters();

  // 6. Live Transaction Stream Ticker
  initTransactionTicker();

  // 7. Refresh AOS on Accordion expansion
  const faq = $('#faqAccordion');
  if (faq) {
    faq.addEventListener('shown.bs.collapse', () => { if (typeof AOS !== 'undefined') AOS.refresh(); });
    faq.addEventListener('hidden.bs.collapse', () => { if (typeof AOS !== 'undefined') AOS.refresh(); });
  }

  // 8. Dynamic Hero Headline Text Rotator
  initHeroTextRotator();
}

/* Hero Headline Rotating Text */
function initHeroTextRotator() {
  const el = $('#heroRotator');
  if (!el) return;
  const words = [
    'Modern Commerce',
    'Global Scale',
    'Autonomous Payouts',
    'High-Growth SaaS'
  ];
  let idx = 0;
  setInterval(() => {
    el.classList.add('rotating-out');
    setTimeout(() => {
      idx = (idx + 1) % words.length;
      el.textContent = words[idx];
      el.classList.remove('rotating-out');
      el.classList.add('rotating-in');
      void el.offsetWidth;
      el.classList.remove('rotating-in');
    }, 400);
  }, 2800);
}

/* Hero Line Chart */
let heroChartInstance = null;
function drawIndexHeroChart() {
  const canvas = $('#heroRevenueChart');
  if (!canvas) return;
  if (heroChartInstance) heroChartInstance.destroy();

  const primary = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#2563eb';
  const muted = getComputedStyle(document.documentElement).getPropertyValue('--muted').trim() || '#64748b';
  const border = getComputedStyle(document.documentElement).getPropertyValue('--border').trim() || '#e2e8f0';

  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 220);
  gradient.addColorStop(0, primary + '55');
  gradient.addColorStop(1, primary + '00');

  const dataPoints = [28000, 36000, 32000, 48000, 42000, 59000, 68000, 62000, 78000, 84000, 92000, 115000, 108000, 142000];
  const labels = ['01 Oct', '02 Oct', '03 Oct', '04 Oct', '05 Oct', '06 Oct', '07 Oct', '08 Oct', '09 Oct', '10 Oct', '11 Oct', '12 Oct', '13 Oct', 'Today'];

  heroChartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Gross Volume',
        data: dataPoints,
        borderColor: primary,
        borderWidth: 2.5,
        backgroundColor: gradient,
        fill: true,
        tension: 0.38,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: primary
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          titleFont: { size: 12 },
          bodyFont: { size: 13, weight: 'bold' },
          padding: 10,
          displayColors: false,
          callbacks: { label: c => fmt(c.parsed.y) }
        }
      },
      scales: {
        x: { ticks: { color: muted, font: { size: 10 } }, grid: { display: false } },
        y: { ticks: { color: muted, font: { size: 10 }, callback: v => (v >= 1000 ? v / 1000 + 'k' : v) }, grid: { color: border } }
      }
    }
  });

  // Range button toggles
  $$('[data-hero-range]').forEach(btn => {
    btn.onclick = () => {
      $$('[data-hero-range]').forEach(b => b.classList.remove('active', 'btn-primary'));
      $$('[data-hero-range]').forEach(b => b.classList.add('btn-outline-secondary'));
      btn.classList.add('active', 'btn-primary');
      btn.classList.remove('btn-outline-secondary');

      const multiplier = { '7D': 0.6, '30D': 1, '90D': 2.4, '1Y': 8.5 }[btn.dataset.heroRange] || 1;
      heroChartInstance.data.datasets[0].data = dataPoints.map(v => Math.round(v * multiplier * (0.85 + Math.random() * 0.3)));
      heroChartInstance.update();
    };
  });
}

/* Analytics Distribution Doughnut Chart */
let analyticsMethodChartInstance = null;
function drawAnalyticsMethodChart() {
  const canvas = $('#analyticsMethodChart');
  if (!canvas) return;
  if (analyticsMethodChartInstance) analyticsMethodChartInstance.destroy();

  const surface = getComputedStyle(document.documentElement).getPropertyValue('--surface').trim() || '#ffffff';
  const muted = getComputedStyle(document.documentElement).getPropertyValue('--muted').trim() || '#64748b';

  analyticsMethodChartInstance = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['UPI 2.0 (48%)', 'Credit/Debit (34%)', 'Net Banking (12%)', 'Wallets/Forex (6%)'],
      datasets: [{
        data: [48, 34, 12, 6],
        backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'],
        borderColor: surface,
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: muted, boxWidth: 12, padding: 15, font: { size: 11, weight: '600' } }
        }
      }
    }
  });
}

/* Savings Calculator */
function initSavingsCalculator() {
  const slider = $('#calcVolume');
  if (!slider) return;

  const updateCalc = () => {
    const vol = +slider.value;
    const curr = getCurrency();
    const fintechFee = vol * 0.017;
    const legacyFee = vol * 0.029;
    const monthlySavings = legacyFee - fintechFee;
    const annualSavings = monthlySavings * 12;

    $('#calcVolDisplay').textContent = fmt(vol, curr);
    $('#calcFintechFee').textContent = fmt(fintechFee, curr) + '/mo';
    $('#calcLegacyFee').textContent = fmt(legacyFee, curr) + '/mo';
    $('#calcSavingsMonth').textContent = fmt(monthlySavings, curr);
    $('#calcSavingsYear').textContent = fmt(annualSavings, curr);
  };

  slider.addEventListener('input', updateCalc);
  document.addEventListener('currencychange', updateCalc);
  updateCalc();
}

/* ==========================================================================
   Rebuilt Next-Gen Code Playground & Multi-Language IDE Simulation
   ========================================================================== */
const CODE_PLAYGROUND = {
  endpoints: {
    payments: {
      name: 'create-payment-intent',
      http: 'POST /v1/payments',
      files: { node: 'payment_intent.js', python: 'payment_intent.py', curl: 'create_payment.sh', go: 'payment_intent.go' },
      snippets: {
        node: `const FinTech = require('@fintech/sdk');
const fintech = new FinTech('sk_live_9a2b8e1f48c02');

// Initialize sub-110ms unified checkout session
const payment = await fintech.payments.create({
  amount: 500000,          // ₹5,000.00
  currency: 'INR',
  customer: {
    name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    phone: '+919876543210'
  },
  methods: ['upi_intent', 'cards', 'netbanking'],
  callback_url: 'https://api.yourbrand.com/v1/verify',
  auto_capture: true
});

console.log('Payment Session Ready:', payment.id, payment.checkout_url);`,

        python: `import fintech
fintech.api_key = "sk_live_9a2b8e1f48c02"

# Initialize sub-110ms unified checkout session
payment = fintech.Payment.create(
    amount=500000,  # ₹5,000.00
    currency="INR",
    customer={
        "name": "Rahul Verma",
        "email": "rahul.verma@example.com"
    },
    methods=["upi_intent", "cards", "netbanking"],
    auto_capture=True
)

print(f"Payment Session Ready: {payment.id}, URL: {payment.checkout_url}")`,

        curl: `curl -X POST https://api.fintechpayments.com/v1/payments \\
  -u sk_live_9a2b8e1f48c02: \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 500000,
    "currency": "INR",
    "customer": {
      "name": "Rahul Verma",
      "email": "rahul.verma@example.com"
    },
    "methods": ["upi_intent", "cards", "netbanking"],
    "auto_capture": true
  }'`,

        go: `package main

import (
    "fmt"
    "github.com/fintech/sdk-go"
)

func main() {
    client := fintech.NewClient("sk_live_9a2b8e1f48c02")

    payment, err := client.Payments.Create(&fintech.PaymentParams{
        Amount:   500000, // ₹5,000.00
        Currency: "INR",
        Customer: &fintech.Customer{
            Name:  "Rahul Verma",
            Email: "rahul.verma@example.com",
        },
        Methods: []string{"upi_intent", "cards", "netbanking"},
    })
    if err != nil {
        panic(err)
    }
    fmt.Printf("Payment Session Ready: %s\\n", payment.ID)
}`
      },
      mockResponse: id => ({
        id: id,
        object: 'payment_intent',
        status: 'authorized',
        amount: 500000,
        currency: getCurrency(),
        method: 'upi_intent',
        latency_ms: 78,
        customer: { id: 'cus_9921', name: 'Rahul Verma', email: 'rahul.verma@example.com' },
        receipt_url: `https://pay.fintech.io/r/${id}`,
        created_at: new Date().toISOString()
      })
    },

    payouts: {
      name: 'create-instant-payout',
      http: 'POST /v1/payouts',
      files: { node: 'instant_payout.js', python: 'instant_payout.py', curl: 'send_payout.sh', go: 'instant_payout.go' },
      snippets: {
        node: `const FinTech = require('@fintech/sdk');
const fintech = new FinTech('sk_live_9a2b8e1f48c02');

// Disburse funds directly to vendor bank / UPI in <3 seconds
const payout = await fintech.payouts.transfer({
  account_number: '91823091823019',
  ifsc: 'HDFC0001234',
  amount: 245000,          // ₹2,450.00
  currency: 'INR',
  mode: 'IMPS',            // 24/7/365 Real-Time Settlement
  reference_id: 'VEND_SETTLE_8892',
  narration: 'Vendor Settlement Oct 2026'
});

console.log('Payout Disbursed:', payout.id, payout.status);`,

        python: `import fintech
fintech.api_key = "sk_live_9a2b8e1f48c02"

# Disburse funds directly to vendor bank / UPI in <3 seconds
payout = fintech.Payout.transfer(
    account_number="91823091823019",
    ifsc="HDFC0001234",
    amount=245000,  # ₹2,450.00
    currency="INR",
    mode="IMPS",    # 24/7/365 Real-Time Settlement
    reference_id="VEND_SETTLE_8892",
    narration="Vendor Settlement Oct 2026"
)

print(f"Payout Disbursed: {payout.id}, Status: {payout.status}")`,

        curl: `curl -X POST https://api.fintechpayments.com/v1/payouts \\
  -u sk_live_9a2b8e1f48c02: \\
  -H "Content-Type: application/json" \\
  -d '{
    "account_number": "91823091823019",
    "ifsc": "HDFC0001234",
    "amount": 245000,
    "currency": "INR",
    "mode": "IMPS",
    "reference_id": "VEND_SETTLE_8892"
  }'`,

        go: `package main

import (
    "fmt"
    "github.com/fintech/sdk-go"
)

func main() {
    client := fintech.NewClient("sk_live_9a2b8e1f48c02")

    payout, err := client.Payouts.Transfer(&fintech.PayoutParams{
        AccountNumber: "91823091823019",
        IFSC:          "HDFC0001234",
        Amount:        245000,
        Currency:      "INR",
        Mode:          "IMPS",
        ReferenceID:   "VEND_SETTLE_8892",
    })
    if err != nil {
        panic(err)
    }
    fmt.Printf("Payout Disbursed: %s Status: %s\\n", payout.ID, payout.Status)
}`
      },
      mockResponse: id => ({
        id: 'po_' + id.replace('pay_', ''),
        object: 'payout',
        status: 'processed',
        amount: 245000,
        currency: getCurrency(),
        mode: 'IMPS',
        utr_number: 'UTR' + Math.floor(100000000000 + Math.random() * 900000000000),
        settlement_latency_ms: 96,
        beneficiary: { account: '******3019', ifsc: 'HDFC0001234' },
        created_at: new Date().toISOString()
      })
    },

    webhooks: {
      name: 'verify-webhook-hmac',
      http: 'POST /v1/webhooks',
      files: { node: 'webhook_listener.js', python: 'webhook_listener.py', curl: 'test_webhook.sh', go: 'webhook_listener.go' },
      snippets: {
        node: `const crypto = require('crypto');

// Zero-packet-loss signed webhook listener
app.post('/webhook', (req, res) => {
  const signature = req.headers['x-fintech-signature'];
  const secret = 'whsec_9934fa88c01b49e29a';

  const expected = crypto
    .createHmac('sha256', secret)
    .update(req.rawBody)
    .digest('hex');

  if (signature === expected) {
    const event = JSON.parse(req.rawBody);
    console.log('Verified Event Received:', event.type);
    return res.status(200).json({ received: true });
  }

  res.status(400).send('Invalid signature');
});`,

        python: `import hmac
import hashlib

# Zero-packet-loss signed webhook listener
def verify_webhook(raw_payload, signature, secret="whsec_9934fa88c01b49e29a"):
    expected = hmac.new(
        secret.encode(),
        raw_payload.encode(),
        hashlib.sha256
    ).hexdigest()

    if hmac.compare_digest(signature, expected):
        print("Verified Webhook Signature: Authenticated")
        return True
    return False`,

        curl: `curl -X POST https://yourdomain.com/webhook \\
  -H "Content-Type: application/json" \\
  -H "X-FinTech-Signature: 8f2b7a3e91c04f98" \\
  -d '{
    "id": "evt_9934fa88",
    "type": "payment.captured",
    "amount": 500000,
    "currency": "INR"
  }'`,

        go: `package main

import (
    "crypto/hmac"
    "crypto/sha256"
    "net/http"
)

func webhookHandler(w http.ResponseWriter, r *http.Request) {
    sig := r.Header.Get("X-FinTech-Signature")
    secret := []byte("whsec_9934fa88c01b49e29a")

    mac := hmac.New(sha256.New, secret)
    // verify payload authenticity...
    w.WriteHeader(http.StatusOK)
}`
      },
      mockResponse: id => ({
        id: 'evt_' + id.replace('pay_', ''),
        object: 'event',
        type: 'payment.captured',
        verified: true,
        signature_algorithm: 'HMAC-SHA256',
        delivery_attempts: 1,
        livemode: false,
        created_at: new Date().toISOString()
      })
    }
  }
};

/* Syntax Token Highlighter */
function highlightCode(code) {
  const escapeHtml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return code.split('\n').map((line, idx) => {
    let l = escapeHtml(line);
    const commentMatch = l.match(/^(\s*)(\/\/|#)(.*)$/);
    if (commentMatch) {
      l = commentMatch[1] + '<span class="tok-cm">' + commentMatch[2] + commentMatch[3] + '</span>';
    } else {
      l = l.replace(/(['"])(.*?)\1/g, '<span class="tok-str">$1$2$1</span>');
      l = l.replace(/\b(\d+)\b/g, '<span class="tok-num">$1</span>');
      l = l.replace(/\b(const|let|var|await|async|import|from|require|package|func|def|return|if|else|new)\b/g, '<span class="tok-kw">$1</span>');
      l = l.replace(/\b(true|false|nil|null|None)\b/g, '<span class="tok-bool">$1</span>');
    }
    const num = (idx + 1).toString().padStart(2, '0');
    return `<div class="code-line"><span class="code-line-num">${num}</span><span class="code-line-content">${l}</span></div>`;
  }).join('');
}

/* Formatted Highlighted JSON */
function formatJsonHighlight(obj) {
  const json = JSON.stringify(obj, null, 2);
  const escapeHtml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return escapeHtml(json).replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, match => {
    let cls = 'tok-num';
    if (/^"/.test(match)) {
      cls = (/:$/.test(match)) ? 'tok-prop' : 'tok-str';
    } else if (/true|false/.test(match)) {
      cls = 'tok-bool';
    } else if (/null/.test(match)) {
      cls = 'tok-cm';
    }
    return `<span class="${cls}">${match}</span>`;
  });
}

function initCodePlayground() {
  const codeBody = $('#codePrismBody');
  const fileName = $('#codeFileName');
  const copyBtn = $('#codeCopyBtn');
  const simulateBtn = $('#btnSimulateApi');
  const responseBox = $('#apiResponseBox');
  const responseContent = $('#apiResponseContent');
  const responseMethodTag = $('#responseMethodTag');
  const responseLatencyTag = $('#responseLatencyTag');
  const copyResponseBtn = $('#copyResponseBtn');
  if (!codeBody) return;

  let currentEndpoint = 'payments';
  let currentLang = 'node';
  let lastResponseData = null;

  const renderCode = () => {
    const ep = CODE_PLAYGROUND.endpoints[currentEndpoint] || CODE_PLAYGROUND.endpoints.payments;
    const rawCode = (ep.snippets[currentLang] || ep.snippets.node).trim();
    codeBody.innerHTML = `<pre>${highlightCode(rawCode)}</pre>`;
    if (fileName) {
      fileName.textContent = ep.files[currentLang] || 'payment_intent.ts';
    }
  };

  // Endpoint Tab Switching
  $$('[data-endpoint]').forEach(tab => {
    tab.onclick = () => {
      $$('[data-endpoint]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentEndpoint = tab.dataset.endpoint;
      renderCode();
    };
  });

  // Language Button Switching
  $$('[data-code-lang]').forEach(btn => {
    btn.onclick = () => {
      $$('[data-code-lang]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentLang = btn.dataset.codeLang;
      renderCode();
    };
  });

  // Initial Render
  renderCode();

  // Copy Snippet
  if (copyBtn) {
    copyBtn.onclick = () => {
      const ep = CODE_PLAYGROUND.endpoints[currentEndpoint] || CODE_PLAYGROUND.endpoints.payments;
      const rawCode = ep.snippets[currentLang] || ep.snippets.node;
      copyToClipboard(rawCode, 'Code snippet copied to clipboard');
      copyBtn.innerHTML = '<i class="bi bi-check2 text-success"></i>';
      setTimeout(() => copyBtn.innerHTML = '<i class="bi bi-clipboard"></i>', 2000);
    };
  }

  // Simulate API Sandbox Call
  if (simulateBtn && responseBox) {
    simulateBtn.onclick = () => {
      simulateBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Dispatching…';
      simulateBtn.disabled = true;

      const randomLatency = Math.floor(62 + Math.random() * 32); // 62ms - 94ms

      setTimeout(() => {
        simulateBtn.innerHTML = '<i class="bi bi-play-circle-fill me-1.5"></i> Run Sandbox Request';
        simulateBtn.disabled = false;

        const ep = CODE_PLAYGROUND.endpoints[currentEndpoint] || CODE_PLAYGROUND.endpoints.payments;
        const randomTxn = 'pay_' + Math.random().toString(36).substring(2, 10);
        lastResponseData = ep.mockResponse(randomTxn);
        lastResponseData.latency_ms = randomLatency;

        if (responseMethodTag) responseMethodTag.textContent = ep.http;
        if (responseLatencyTag) responseLatencyTag.textContent = `Response (${randomLatency}ms)`;
        if (responseContent) {
          responseContent.innerHTML = `<pre class="mb-0">${formatJsonHighlight(lastResponseData)}</pre>`;
        }

        responseBox.classList.remove('d-none');
        if (typeof AOS !== 'undefined') AOS.refresh();
        showToast(`HTTP 200 OK — ${ep.http} executed successfully (${randomLatency}ms)`);
      }, 550);
    };
  }

  // Copy Response JSON
  if (copyResponseBtn) {
    copyResponseBtn.onclick = () => {
      if (!lastResponseData) return;
      copyToClipboard(JSON.stringify(lastResponseData, null, 2), 'Response JSON copied to clipboard');
    };
  }
}

/* Payment Method Filters */
function initMethodFilters() {
  const buttons = $$('[data-method-filter]');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.onclick = () => {
      buttons.forEach(b => {
        b.classList.remove('active', 'btn-primary');
        b.classList.add('btn-outline-secondary');
      });
      btn.classList.add('active', 'btn-primary');
      btn.classList.remove('btn-outline-secondary');

      const filter = btn.dataset.methodFilter;
      $$('.method-card-item').forEach(card => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
      if (typeof AOS !== 'undefined') AOS.refresh();
    };
  });
}

/* Live Transaction Stream Ticker */
function initTransactionTicker() {
  const tickerCustomer = $('#tickerCustomer');
  const tickerAmount = $('#tickerAmount');
  const tickerMethod = $('#tickerMethod');
  const tickerId = $('#tickerId');
  if (!tickerCustomer) return;

  const mockTxns = [
    { id: 'TXN-20261003-0891', name: 'Aarav Mehta', amt: 12500, method: 'UPI 2.0' },
    { id: 'TXN-20261003-0892', name: 'Neha Sharma', amt: 34800, method: 'HDFC Credit Card' },
    { id: 'TXN-20261003-0893', name: 'Rahul Verma', amt: 5200, method: 'Google Pay' },
    { id: 'TXN-20261003-0894', name: 'Priya Patel', amt: 94000, method: 'NEFT Payout' },
    { id: 'TXN-20261003-0895', name: 'Arjun Shah', amt: 18750, method: 'RuPay Card' },
    { id: 'TXN-20261003-0896', name: 'Kavya Nair', amt: 46200, method: 'Net Banking' }
  ];

  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % mockTxns.length;
    const item = mockTxns[idx];
    tickerCustomer.textContent = item.name;
    tickerAmount.textContent = fmt(item.amt);
    tickerMethod.textContent = item.method;
    tickerId.textContent = item.id;
    tickerAmount.classList.add('text-success');
  }, 4200);
}

/* ==========================================================================
   Dashboard Data Engine & Tables (Preserved for Dashboard Pages)
   ========================================================================== */
const NAMES = ['Aarav Mehta', 'Neha Sharma', 'Rahul Verma', 'Priya Patel', 'Arjun Shah', 'Kavya Nair', 'Rohan Desai', 'Ananya Iyer', 'Vikram Singh', 'Meera Joshi'];
const METHODS = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet', 'Bank Transfer'];
const PAGES = {
  transactions: ['Transactions', 'TXN-20261003-', ['Transaction ID', 'Customer', 'Amount', 'Method', 'Status', 'Date'], ['Successful', 'Pending', 'Failed', 'Refunded', 'Disputed']],
  customers: ['Customers', 'CUS-', ['Customer ID', 'Name', 'Total Spent', 'Last Method', 'Status', 'Last Payment'], ['Active', 'Active', 'Disabled']],
  'payment-links': ['Payment Links', 'PL-', ['Link', 'Customer', 'Amount', 'Type', 'Status', 'Expiry'], ['Active', 'Expired', 'Active']],
  invoices: ['Invoices', 'INV-2026-', ['Invoice', 'Customer', 'Amount', 'Method', 'Status', 'Due Date'], ['Paid', 'Pending', 'Overdue']],
  subscriptions: ['Subscriptions', 'SUB-', ['Subscription', 'Customer', 'Amount', 'Cycle', 'Status', 'Next Billing'], ['Active', 'Trial', 'Cancelled', 'Active']],
  payouts: ['Payouts', 'PO-', ['Payout ID', 'Recipient', 'Amount', 'Method', 'Status', 'Date'], ['Completed', 'Pending', 'Failed', 'Completed']],
  settlements: ['Settlements', 'SET-', ['Settlement ID', 'Bank Account', 'Amount', 'Method', 'Status', 'Initiated'], ['Completed', 'Pending', 'Completed']],
  refunds: ['Refunds', 'RF-', ['Refund ID', 'Customer', 'Amount', 'Reason', 'Status', 'Date'], ['Refunded', 'Pending', 'Refunded']],
  disputes: ['Disputes', 'DSP-', ['Dispute ID', 'Customer', 'Amount', 'Reason', 'Status', 'Deadline'], ['Open', 'Under Review', 'Won', 'Lost']],
  'api-keys': ['API Keys', 'key_', ['Key ID', 'Name', 'Created By', 'Environment', 'Status', 'Created'], ['Active', 'Revoked', 'Active']],
  webhooks: ['Webhooks', 'wh_', ['Endpoint ID', 'URL', 'Success Rate', 'Events', 'Status', 'Last Delivery'], ['Active', 'Failing', 'Active']],
  team: ['Team', 'USR-', ['User ID', 'Name', 'Role', 'Email domain', 'Status', 'Last Active'], ['Active', 'Invited', 'Active']],
  'audit-logs': ['Audit Logs', 'LOG-', ['Log ID', 'User', 'Action', 'Resource', 'Result', 'Timestamp'], ['Success', 'Success', 'Failed']]
};

const REASONS = ['Duplicate charge', 'Product not received', 'Customer request', 'Fraud claim'];
const ROLES = ['Owner', 'Admin', 'Finance', 'Developer', 'Analyst', 'Support'];
const ACTIONS = ['Changed payout settings', 'Created API key', 'Exported report', 'Invited member'];
const dstr = i => new Date(2026, 9, 3 - i % 28).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

function makeRows(key, n = 64) {
  const p = PAGES[key][1], st = PAGES[key][3];
  return Array.from({ length: n }, (_, i) => {
    const nm = NAMES[(i * 7) % 10], amt = (((i * 7919) % 98) + 2) * 250, s = st[i % st.length];
    const c = {
      customers: [nm, amt * 6, METHODS[i % 6]],
      'api-keys': ['Server ' + (i % 5 + 1), nm, i % 2 ? 'Test' : 'Live'],
      webhooks: ['https://api.shop' + (i % 9) + '.in/hooks', (95 + i % 5) + '%', (i % 4 + 3) + ' events'],
      team: [nm, ROLES[i % 6], 'company.in'],
      'audit-logs': [nm, ACTIONS[i % 4], 'Settings'],
      refunds: [nm, amt, REASONS[i % 4]],
      disputes: [nm, amt, REASONS[i % 4]],
      settlements: ['HDFC ••' + (1000 + i), amt * 10, 'NEFT']
    }[key] || [nm, amt, METHODS[i % 6]];
    return [p + (1000 + i), ...c, s, dstr(i)];
  });
}

const BADGE = {
  Successful: 'success', Completed: 'success', Active: 'success', Paid: 'success', Won: 'success', Success: 'success',
  Pending: 'warning', 'Under Review': 'warning',
  Trial: 'info', Invited: 'info', Open: 'info',
  Failed: 'danger', Overdue: 'danger', Lost: 'danger', Failing: 'danger', Disputed: 'danger',
  Revoked: 'secondary', Cancelled: 'secondary', Expired: 'secondary', Disabled: 'secondary', Refunded: 'secondary'
};

function dataTable(el, key) {
  const title = PAGES[key][0], heads = PAGES[key][2], st = PAGES[key][3];
  let rows = makeRows(key), q = '', f = '', sc = -1, asc = true, pg = 1, cur = [];
  const per = 8;

  el.innerHTML = `
  <div class="card"><div class="card-body d-flex flex-wrap gap-2">
  <input id="q" class="form-control w-auto flex-grow-1" style="max-width:320px" type="search" placeholder="Search ${title.toLowerCase()}…" aria-label="Search">
  <select id="f" class="form-select w-auto" aria-label="Status filter"><option value="">All statuses</option>${[...new Set(st)].map(s => `<option>${s}</option>`).join('')}</select>
  <button id="ex" class="btn btn-outline-secondary ms-auto"><i class="bi bi-download"></i> Export CSV</button>
  <button id="nw" class="btn btn-primary"><i class="bi bi-plus-lg"></i> New</button></div>
  <div class="table-responsive"><table class="table table-hover mb-0"><thead><tr>${heads.map((h, i) => `<th data-i="${i}">${h} <i class="bi bi-arrow-down-up small"></i></th>`).join('')}<th>Actions</th></tr></thead><tbody></tbody></table></div>
  <div class="card-footer d-flex justify-content-between align-items-center"><small id="info" class="text-muted"></small><ul class="pagination pagination-sm mb-0"></ul></div></div>`;

  const draw = () => {
    let r = rows.filter(x => (!f || x[x.length - 2] === f) && x.join(' ').toLowerCase().includes(q));
    if (sc >= 0) r.sort((a, b) => (a[sc] > b[sc] ? 1 : -1) * (asc ? 1 : -1));
    const pages = Math.max(1, Math.ceil(r.length / per));
    pg = Math.min(pg, pages);
    cur = r;

    $('tbody', el).innerHTML = r.length ? r.slice((pg - 1) * per, pg * per).map(x =>
      '<tr>' + x.map((c, i) => i === x.length - 2 ? `<td><span class="badge-soft text-bg-${BADGE[c] || 'secondary'}">${c}</span></td>` : typeof c === 'number' ? `<td>${fmt(c)}</td>` : i === 0 ? `<td><a href="#" class="cp fw-semibold text-decoration-none" title="Copy ID">${c}</a></td>` : `<td>${c}</td>`).join('') +
      '<td><button class="btn btn-sm btn-outline-secondary vw" data-r="' + rows.indexOf(x) + '">View</button> <button class="btn btn-sm btn-outline-danger dl" aria-label="Delete" data-r="' + rows.indexOf(x) + '"><i class="bi bi-trash"></i></button></td></tr>'
    ).join('') : `<tr><td colspan="9" class="text-center py-5 text-muted"><i class="bi bi-inbox fs-2 d-block"></i>No ${title.toLowerCase()} found</td></tr>`;

    el.querySelectorAll('tbody tr').forEach(tr => tr.querySelectorAll('td').forEach((td, i) => td.dataset.label = heads[i] || 'Actions'));
    $('#info', el).textContent = `${r.length} results`;
    $('.pagination', el).innerHTML = Array.from({ length: pages }, (_, i) => `<li class="page-item ${i + 1 === pg ? 'active' : ''}"><a class="page-link" href="#" data-p="${i + 1}">${i + 1}</a></li>`).join('');
  };

  el.addEventListener('click', e => {
    const t = e.target, p = t.closest('[data-p]'), h = t.closest('th[data-i]'), c = t.closest('.cp'), v = t.closest('.vw');
    if (p || c) e.preventDefault();
    if (p) { pg = +p.dataset.p; draw(); }
    if (h) { const i = +h.dataset.i; asc = sc === i ? !asc : true; sc = i; draw(); }
    if (c) copyToClipboard(c.textContent);
    if (v) detailDrawer(key, rows[+v.dataset.r]);
    const d = t.closest('.dl');
    if (d) confirmModal('Delete this record?', 'This action cannot be undone.', () => {
      rows.splice(+d.dataset.r, 1);
      draw();
      showToast('Record deleted', 'warning');
    });
  });

  $('#q', el).oninput = e => { q = e.target.value.toLowerCase(); pg = 1; draw(); };
  $('#f', el).onchange = e => { f = e.target.value; pg = 1; draw(); };
  $('#nw', el).onclick = () => formModal(key, r => { rows.unshift(r); pg = 1; draw(); showToast(title.replace(/s$/, '') + ' created successfully'); });
  $('#ex', el).onclick = () => {
    const csv = [heads, ...cur].map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = key + '.csv';
    a.click();
    showToast('CSV exported');
  };
  draw();
}

/* Dashboard Charts */
const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
let charts = [];
const seed = (n, b) => Array.from({ length: n }, (_, i) => Math.round(b + b * 0.35 * Math.sin(i / 3) + ((i * 7919) % 13) * b * 0.03));
const RANGES = { '7D': 7, '30D': 30, '90D': 45, '1Y': 12 };
let range = '30D';

function drawCharts() {
  if (!$('#cStatus')) return;
  charts.forEach(c => c.destroy());
  charts = [];
  const tx = css('--muted'), gr = css('--border'), pr = css('--primary');
  const n = RANGES[range], lab = Array.from({ length: n }, (_, i) => range === '1Y' ? ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'][i] : 'D' + (i + 1));
  const sc = { x: { ticks: { color: tx }, grid: { color: gr } }, y: { ticks: { color: tx }, grid: { color: gr } } };

  charts.push(new Chart($('#cRev'), {
    type: 'line',
    data: {
      labels: lab,
      datasets: [
        { label: 'Revenue', data: seed(n, 150000), borderColor: pr, backgroundColor: pr + '22', fill: true, tension: 0.35 },
        { label: 'Refunds', data: seed(n, 9000), borderColor: '#dc2626', tension: 0.35 }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false, scales: sc, plugins: { legend: { labels: { color: tx } } } }
  }));

  charts.push(new Chart($('#cStatus'), {
    type: 'doughnut',
    data: {
      labels: ['Successful 87%', 'Failed 5%', 'Pending 5%', 'Refunded 3%'],
      datasets: [{ data: [87, 5, 5, 3], backgroundColor: ['#16a34a', '#dc2626', '#f59e0b', '#64748b'], borderColor: css('--surface') }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: tx } } } }
  }));
}

function overview(el) {
  const K = [
    ['Total Revenue', '₹48,52,320', '+12.8%', 'wallet2'],
    ['Successful Payments', '₹42,31,120', '+9.4%', 'check-circle'],
    ['Failed Payments', '₹2,31,450', '-1.2%', 'x-circle'],
    ['Refunds', '₹1,21,200', '+0.6%', 'arrow-return-left'],
    ['Available Balance', '₹8,42,120', '+4.1%', 'bank'],
    ['Pending Settlement', '₹3,42,500', '+2.3%', 'hourglass-split']
  ];

  el.innerHTML = `
  <div class="row g-3 mb-3">${K.map(k => `<div class="col-6 col-xl-4"><div class="card stat"><div class="card-body"><div class="d-flex justify-content-between text-muted small">${k[0]}<span class="icon-tile"><i class="bi bi-${k[3]}"></i></span></div><div class="v">${k[1]}</div><small class="${k[2][0] === '+' ? 'text-success' : 'text-danger'}"><i class="bi bi-arrow-${k[2][0] === '+' ? 'up' : 'down'}-right"></i> ${k[2]} vs last period</small></div></div></div>`).join('')}</div>
  <div class="d-flex flex-wrap gap-2 mb-3">${[['Accept Payment', 'credit-card'], ['Payment Link', 'link-45deg'], ['Invoice', 'receipt'], ['Send Payout', 'send'], ['Issue Refund', 'arrow-return-left']].map(a => `<button class="btn btn-outline-secondary btn-sm" onclick="quickModal('${a[0]}')"><i class="bi bi-${a[1]}"></i> ${a[0]}</button>`).join('')}</div>
  <div class="row g-3 mb-3"><div class="col-lg-8"><div class="card"><div class="card-body"><div class="d-flex justify-content-between mb-2"><h2 class="h6">Revenue overview</h2><div class="btn-group btn-group-sm" id="rg">${Object.keys(RANGES).map(r => `<button class="btn btn-outline-secondary ${r === range ? 'active' : ''}">${r}</button>`).join('')}</div></div><div class="chart-box"><canvas id="cRev" aria-label="Revenue chart" role="img"></canvas></div></div></div></div>
  <div class="col-lg-4"><div class="card h-100"><div class="card-body"><h2 class="h6">Payment status</h2><div class="chart-box"><canvas id="cStatus" aria-label="Payment status chart" role="img"></canvas></div></div></div></div></div>
  <h2 class="h6">Recent transactions</h2><div id="rt"></div>`;

  $('#rg').onclick = e => {
    if (e.target.tagName === 'BUTTON') {
      range = e.target.textContent;
      [...$('#rg').children].forEach(b => b.classList.toggle('active', b === e.target));
      drawCharts();
    }
  };
  dataTable($('#rt'), 'transactions');
  drawCharts();
}

/* Dashboard Shell */
const ICONS = { transactions: 'arrow-left-right', customers: 'people', 'payment-links': 'link-45deg', invoices: 'receipt', subscriptions: 'arrow-repeat', payouts: 'send', settlements: 'bank', refunds: 'arrow-return-left', disputes: 'exclamation-triangle', 'api-keys': 'key', webhooks: 'braces', team: 'person-gear', 'audit-logs': 'journal-text' };

function dashLayout() {
  const cur = document.body.dataset.page, items = [['index', 'Overview', 'speedometer2'], ...Object.keys(PAGES).map(k => [k, PAGES[k][0], ICONS[k]])];
  if (localStorage.getItem('fintech-collapsed') === '1') document.body.classList.add('collapsed');

  document.body.insertAdjacentHTML('afterbegin', `
  <aside class="sidebar offcanvas-lg offcanvas-start" id="sb" tabindex="-1" aria-label="Main navigation">
    <div class="p-3 d-flex justify-content-between"><a href="index.html" class="text-white fw-bold text-decoration-none"><i class="bi bi-shield-check text-primary"></i> <span class="lbl">FinTech Payments</span></a><button class="btn-close btn-close-white d-lg-none" data-bs-dismiss="offcanvas" data-bs-target="#sb" aria-label="Close"></button></div>
    <nav class="nav flex-column px-2 gap-1 overflow-auto">${items.map(i => `<a class="nav-link ${i[0] === cur ? 'active' : ''}" href="${i[0]}.html" title="${i[1]}"><i class="bi bi-${i[2]}"></i><span class="lbl">${i[1]}</span></a>`).join('')}<a class="nav-link mt-3" href="../index.html"><i class="bi bi-box-arrow-left"></i><span class="lbl">Logout</span></a></nav>
  </aside>
  <div class="main">
    <header class="topbar px-3 py-2 d-flex align-items-center gap-2">
      <button class="btn btn-outline-secondary d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#sb" aria-label="Open menu"><i class="bi bi-list"></i></button>
      <button id="col" class="btn btn-outline-secondary d-none d-lg-block" aria-label="Collapse sidebar"><i class="bi bi-layout-sidebar"></i></button>
      <h1 class="h5 mb-0 ms-1">${cur === 'index' ? 'Overview' : PAGES[cur][0]}</h1>
      <div class="ms-auto d-flex gap-2 align-items-center">
        <div class="dropdown"><button class="btn btn-outline-secondary" data-bs-toggle="dropdown" aria-label="Notifications"><i class="bi bi-bell"></i><span class="badge text-bg-danger ms-1">3</span></button><ul class="dropdown-menu dropdown-menu-end p-2" style="min-width:280px"><li class="small p-2"><strong>Payment received</strong><br>₹25,000 from Rahul Verma</li><li class="small p-2"><strong>Settlement completed</strong><br>₹1,25,000 settled</li><li class="small p-2"><strong>Security alert</strong><br>New API key generated</li></ul></div>
        <div class="dropdown"><button class="btn btn-outline-secondary" data-bs-toggle="dropdown" aria-label="Theme"><i class="bi bi-palette"></i></button><ul class="dropdown-menu dropdown-menu-end">${themeMenu()}</ul></div>
        <div class="dropdown"><button class="btn btn-primary" data-bs-toggle="dropdown" aria-label="Profile">KM</button><ul class="dropdown-menu dropdown-menu-end"><li class="dropdown-header">Ketan Mali · Admin</li><li><a class="dropdown-item" href="team.html">Team</a></li><li><a class="dropdown-item" href="../index.html">Logout</a></li></ul></div>
      </div>
    </header>
    <main class="p-3 p-lg-4" id="view"></main>
  </div>`);

  $('#col').onclick = () => {
    document.body.classList.toggle('collapsed');
    localStorage.setItem('fintech-collapsed', document.body.classList.contains('collapsed') ? 1 : 0);
  };
  cur === 'index' ? overview($('#view')) : dataTable($('#view'), cur);
}

/* Modals & Dialogs */
function modal({ title, body, footer = '', icon = '', tone = 'primary', size = '' }) {
  const id = 'm' + Date.now();
  document.body.insertAdjacentHTML('beforeend', `
  <div class="modal fade" id="${id}" tabindex="-1" aria-labelledby="${id}t" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable ${size}">
      <div class="modal-content">
        <div class="modal-header border-0 pb-0">
          <div class="d-flex gap-3 align-items-center">${icon ? `<span class="icon-tile text-${tone}"><i class="bi bi-${icon}"></i></span>` : ''}<h2 class="modal-title h5 mb-0" id="${id}t">${title}</h2></div>
          <button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">${body}</div>
        <div class="modal-footer border-0">${footer}</div>
      </div>
    </div>
  </div>`);
  const el = $('#' + id), m = new bootstrap.Modal(el);
  el.addEventListener('hidden.bs.modal', () => el.remove());
  m.show();
  return { el, m };
}

function confirmModal(title, msg, ok, label = 'Confirm Delete') {
  const { el, m } = modal({
    title, icon: 'exclamation-triangle', tone: 'danger', size: 'modal-sm',
    body: `<p class="text-muted mb-0">${msg}</p>`,
    footer: `<button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button><button class="btn btn-danger" id="ok">${label}</button>`
  });
  $('#ok', el).onclick = () => { m.hide(); ok(); };
}

function formModal(key, cb) {
  const [t, p, h, st] = PAGES[key], f = h.slice(1, -1), num = l => /Amount|Spent/.test(l);
  const { el, m } = modal({
    title: 'New ' + t.replace(/s$/, ''), icon: 'plus-circle',
    body: `<form id="mf" novalidate>${f.map((l, i) => `<div class="mb-3"><label class="form-label" for="f${i}">${l}</label>${i === f.length - 1 ? `<select id="f${i}" class="form-select">${[...new Set(st)].map(x => `<option>${x}</option>`).join('')}</select>` : `<input id="f${i}" class="form-control" required ${num(l) ? 'type="number" min="1" step="any"' : ''}><div class="invalid-feedback">${num(l) ? 'Enter a positive amount.' : l + ' is required.'}</div>`}</div>`).join('')}</form>`,
    footer: '<button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" id="ok">Create</button>'
  });
  $('#ok', el).onclick = () => {
    const fm = $('#mf', el);
    fm.classList.add('was-validated');
    if (!fm.checkValidity()) return;
    cb([p + (2000 + Math.floor(Math.random() * 900)), ...f.map((l, i) => num(l) ? +$('#f' + i, el).value : $('#f' + i, el).value), dstr(0)]);
    m.hide();
  };
}

function quickModal(name) {
  const { el, m } = modal({
    title: name, icon: 'lightning-charge',
    body: `<form id="mf" novalidate><div class="mb-3"><label class="form-label" for="qc">Customer</label><select id="qc" class="form-select">${NAMES.map(n => `<option>${n}</option>`).join('')}</select></div><div class="mb-3"><label class="form-label" for="qa">Amount (₹)</label><input id="qa" type="number" min="1" class="form-control" required><div class="invalid-feedback">Enter a positive amount.</div></div><div><label class="form-label" for="qd">Note</label><input id="qd" class="form-control" placeholder="Optional"></div></form>`,
    footer: `<button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" id="ok">${name}</button>`
  });
  $('#ok', el).onclick = () => {
    const fm = $('#mf', el);
    fm.classList.add('was-validated');
    if (!fm.checkValidity()) return;
    m.hide();
    showToast(name + ' completed for ' + fmt(+$('#qa', el).value));
  };
}

function detailDrawer(key, r) {
  const t = PAGES[key][0], h = PAGES[key][2], s = r[r.length - 2];
  document.body.insertAdjacentHTML('beforeend', `
  <div class="offcanvas offcanvas-end drawer" tabindex="-1" id="dr" aria-labelledby="drt">
    <div class="offcanvas-header">
      <div><small class="text-muted">${t.replace(/s$/, '')} details</small><h2 class="h5 mb-0" id="drt">${r[0]}</h2></div>
      <button class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <span class="badge-soft text-bg-${BADGE[s] || 'secondary'}">${s}</span>
      <dl class="row mt-3 small">${h.slice(1).map((l, i) => `<dt class="col-5 text-muted fw-normal">${l}</dt><dd class="col-7 fw-semibold">${typeof r[i + 1] === 'number' ? fmt(r[i + 1]) : r[i + 1]}</dd>`).join('')}</dl>
      <h3 class="h6 mt-4">Timeline</h3>
      <ul class="timeline list-unstyled">${['Created', 'Authorized', 'Captured', 'Settlement processing'].map((x, i) => `<li class="${i < 3 ? 'done' : ''}">${x}</li>`).join('')}</ul>
    </div>
    <div class="p-3 border-top d-flex gap-2">
      <button class="btn btn-outline-secondary flex-fill" data-copy><i class="bi bi-clipboard"></i> Copy ID</button>
      <button class="btn btn-primary flex-fill" data-dl><i class="bi bi-download"></i> Receipt</button>
    </div>
  </div>`);
  const el = $('#dr');
  $('[data-copy]', el).onclick = () => copyToClipboard(r[0]);
  $('[data-dl]', el).onclick = () => showToast('Receipt downloaded');
  el.addEventListener('hidden.bs.offcanvas', () => el.remove());
  new bootstrap.Offcanvas(el).show();
}

function initForms() {
  document.querySelectorAll('form.needs-validation').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    f.classList.add('was-validated');
    if (f.checkValidity()) {
      showToast('Success - redirecting…');
      setTimeout(() => location.href = f.dataset.next, 800);
    }
  }));
}

/* Initialization */
Promise.all([
  window.libsReady,
  new Promise(r => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', r) : r())
]).then(() => {
  setTheme(localStorage.getItem('fintech-theme') || 'dark');
  const l = document.body.dataset.layout;
  if (l === 'public') publicLayout();
  else if (l === 'dash') dashLayout();
  initForms();
});

document.addEventListener('themechange', () => {
  if ($('#cRev') && document.body.dataset.layout === 'dash') drawCharts();
  if ($('#heroRevenueChart')) drawIndexHeroChart();
  if ($('#analyticsMethodChart')) drawAnalyticsMethodChart();
  if (typeof AOS !== 'undefined') AOS.refresh();
});
