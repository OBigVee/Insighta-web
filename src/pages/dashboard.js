import { apiFetch } from '../utils/api.js';
import { renderLayout } from '../main.js';

export async function renderDashboard(app) {
  renderLayout(app, 'dashboard', `
    <div class="page-header">
      <h1>Dashboard</h1>
      <p>Overview of the Profile Intelligence System</p>
    </div>
    <div class="stats-grid" id="stats-grid">
      <div class="loading"><div class="spinner"></div> Loading stats...</div>
    </div>
  `);

  try {
    // Fetch first page to get total count
    const resp = await apiFetch('/api/profiles?page=1&limit=1');
    const data = await resp.json();

    if (data.status !== 'success') {
      document.getElementById('stats-grid').innerHTML = '<p>Failed to load stats</p>';
      return;
    }

    // Fetch a sample to compute stats
    const sampleResp = await apiFetch('/api/profiles?page=1&limit=50');
    const sampleData = await sampleResp.json();
    const profiles = sampleData.data || [];

    const maleCount = profiles.filter(p => p.gender === 'male').length;
    const femaleCount = profiles.filter(p => p.gender === 'female').length;
    const countries = [...new Set(profiles.map(p => p.country_id))];
    const avgAge = profiles.length > 0
      ? Math.round(profiles.reduce((sum, p) => sum + (p.age || 0), 0) / profiles.length)
      : 0;

    document.getElementById('stats-grid').innerHTML = `
      <div class="stat-card">
        <div class="stat-label">Total Profiles</div>
        <div class="stat-value">${data.total.toLocaleString()}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Male (sample)</div>
        <div class="stat-value" style="color: #60a5fa">${maleCount}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Female (sample)</div>
        <div class="stat-value" style="color: #f472b6">${femaleCount}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Countries (sample)</div>
        <div class="stat-value">${countries.length}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Avg Age (sample)</div>
        <div class="stat-value">${avgAge}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Pages</div>
        <div class="stat-value">${data.total_pages}</div>
      </div>
    `;
  } catch (err) {
    document.getElementById('stats-grid').innerHTML = `<p>Error: ${err.message}</p>`;
  }
}
