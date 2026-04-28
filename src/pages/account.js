import { apiFetch } from '../utils/api.js';
import { renderLayout } from '../main.js';

export async function renderAccount(app) {
  renderLayout(app, 'account', `
    <div class="page-header">
      <h1>Account Settings</h1>
      <p>Manage your Insighta Labs+ profile</p>
    </div>
    <div id="account-content" class="loading"><div class="spinner"></div> Loading account...</div>
  `);

  try {
    const resp = await apiFetch('/auth/me');
    const data = await resp.json();

    if (data.status !== 'success') throw new Error(data.message || 'Failed to load user info');
    const user = data.data;

    document.getElementById('account-content').innerHTML = `
      <div class="account-card">
        <div class="account-header">
          <img src="${escapeHTML(user.avatar_url) || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'}" alt="Avatar" class="account-avatar" />
          <div>
            <div class="account-name">${escapeHTML(user.username)}</div>
            <div class="account-role">${user.role}</div>
          </div>
        </div>
        
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">Email</span>
            <span class="detail-value">${escapeHTML(user.email) || '<em>Not provided</em>'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Status</span>
            <span class="detail-value" style="color: ${user.is_active ? 'var(--success)' : 'var(--danger)'};">
              ${user.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div class="detail-item" style="grid-column: 1 / -1;">
            <span class="detail-label">User ID</span>
            <span class="detail-value" style="font-family: monospace; font-size: 0.9rem;">${user.id}</span>
          </div>
        </div>

        <div class="account-section-title">CLI Integration</div>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">
          Use this command to authenticate your CLI if the automatic login fails in a remote environment:
        </p>
        <div class="cli-command-box">
          <code id="cli-login-command">./insighta auth-set --access ${localStorage.getItem('access_token')} --refresh ${localStorage.getItem('refresh_token')} --username ${user.username}</code>
          <button id="btn-copy-cli" class="btn-copy">Copy</button>
        </div>

        <button id="btn-logout" class="btn-logout" style="margin-top: 24px;">Logout</button>
      </div>
    `;

    document.getElementById('btn-copy-cli').addEventListener('click', () => {
      const cmd = document.getElementById('cli-login-command').textContent;
      navigator.clipboard.writeText(cmd);
      const btn = document.getElementById('btn-copy-cli');
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = 'Copy', 2000);
    });

    document.getElementById('btn-logout').addEventListener('click', async () => {
      try {
        const refresh = localStorage.getItem('refresh_token');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        await apiFetch('/auth/logout', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refresh || '' })
        });
        window.location.hash = '#/login';
      } catch (err) {
        alert('Logout failed: ' + err.message);
      }
    });

  } catch (err) {
    document.getElementById('account-content').innerHTML = `
      <div class="account-card">
        <p style="color: var(--danger);">${escapeHTML(err.message)}</p>
      </div>
    `;
  }
}

function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.innerText = str;
  return div.innerHTML;
}
