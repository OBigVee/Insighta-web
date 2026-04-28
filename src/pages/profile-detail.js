import { apiFetch } from '../utils/api.js';
import { renderLayout } from '../main.js';

export async function renderProfileDetail(app, params) {
  renderLayout(app, 'profiles', `
    <button class="btn-back" onclick="window.history.back()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
      Back
    </button>
    <div id="detail-content" class="loading"><div class="spinner"></div> Loading profile...</div>
  `);

  try {
    const resp = await apiFetch(`/api/profiles/${params.id}`);
    const data = await resp.json();

    if (data.status !== 'success') throw new Error(data.message || 'Profile not found');
    const p = data.data;

    document.getElementById('detail-content').innerHTML = `
      <div class="profile-detail">
        <h2>${escapeHTML(p.name)}</h2>
        
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">ID</span>
            <span class="detail-value" style="font-family: monospace; font-size: 0.9rem;">${p.id}</span>
          </div>
          
          <div class="detail-item">
            <span class="detail-label">Gender</span>
            <span class="detail-value">
              <span class="badge badge-${p.gender}">${p.gender}</span>
              <span style="color: var(--text-muted); font-size: 0.85rem; margin-left: 8px;">
                ${(p.gender_probability * 100).toFixed(0)}% confidence
              </span>
            </span>
          </div>

          <div class="detail-item">
            <span class="detail-label">Age</span>
            <span class="detail-value">${p.age} <span style="color: var(--text-muted); font-size: 0.85rem;">(${p.age_group})</span></span>
          </div>

          <div class="detail-item">
            <span class="detail-label">Country</span>
            <span class="detail-value">${escapeHTML(p.country_name)} <span style="color: var(--text-muted); font-size: 0.85rem;">(${p.country_id})</span></span>
          </div>

          <div class="detail-item">
            <span class="detail-label">Country Confidence</span>
            <span class="detail-value">${(p.country_probability * 100).toFixed(0)}%</span>
          </div>

          <div class="detail-item">
            <span class="detail-label">Created At</span>
            <span class="detail-value">${new Date(p.created_at).toLocaleString()}</span>
          </div>
        </div>
      </div>
    `;

  } catch (err) {
    document.getElementById('detail-content').innerHTML = `
      <div class="profile-detail">
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
