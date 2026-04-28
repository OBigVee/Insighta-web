import { Router } from './utils/router.js';
import { renderLogin } from './pages/login.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderProfiles } from './pages/profiles.js';
import { renderProfileDetail } from './pages/profile-detail.js';
import { renderSearch } from './pages/search.js';
import { renderAccount } from './pages/account.js';
import { renderAuthCallback } from './pages/auth-callback.js';

const app = document.getElementById('app');

const router = new Router({
  '/login': () => renderLogin(app),
  '/dashboard': () => renderDashboard(app),
  '/profiles': () => renderProfiles(app),
  '/profiles/:id': (params) => renderProfileDetail(app, params),
  '/search': () => renderSearch(app),
  '/account': () => renderAccount(app),
  '/auth-callback': () => renderAuthCallback(app),
});

router.start();

export function renderLayout(app, activeTab, innerHTML) {
  const ICONS = {
    dashboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>`,
    profiles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    account: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`
  };

  // Check if we need to re-render the whole layout
  if (!document.getElementById('main-content-area')) {
    app.innerHTML = `
      <div class="app-layout">
        <aside class="sidebar">
          <div class="sidebar-logo">Insighta <span>Labs+</span></div>
          <nav class="sidebar-nav">
            <a class="nav-link ${activeTab === 'dashboard' ? 'active' : ''}" href="#/dashboard">
              ${ICONS.dashboard} Dashboard
            </a>
            <a class="nav-link ${activeTab === 'profiles' ? 'active' : ''}" href="#/profiles">
              ${ICONS.profiles} Profiles
            </a>
            <a class="nav-link ${activeTab === 'search' ? 'active' : ''}" href="#/search">
              ${ICONS.search} Search
            </a>
          </nav>
          <div class="sidebar-footer">
            <a class="nav-link ${activeTab === 'account' ? 'active' : ''}" href="#/account">
              ${ICONS.account} Account
            </a>
          </div>
        </aside>
        <main class="main-content" id="main-content-area">
          ${innerHTML}
        </main>
      </div>
    `;
  } else {
    // Only update active state and inner HTML
    document.querySelectorAll('.nav-link').forEach(link => {
      const tab = link.getAttribute('href').replace('#/', '');
      link.classList.toggle('active', tab === activeTab || (activeTab === 'profiles' && tab.startsWith('profiles')));
    });
    document.getElementById('main-content-area').innerHTML = innerHTML;
  }
}
