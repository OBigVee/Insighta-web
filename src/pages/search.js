import { apiFetch } from '../utils/api.js';
import { renderLayout } from '../main.js';

export async function renderSearch(app) {
  renderLayout(app, 'search', `
    <div class="page-header">
      <h1>Natural Language Search</h1>
      <p>Search profiles using conversational queries (e.g., "young males from nigeria")</p>
    </div>

    <div class="search-container">
      <form id="search-form" class="search-box">
        <input type="text" id="search-input" class="search-input" placeholder="Enter your query..." autocomplete="off" />
        <button type="submit" class="btn-search">Search</button>
      </form>

      <div class="table-container" id="search-results" style="display: none;">
        <div class="table-toolbar">
          <h3 style="font-size: 1rem; font-weight: 600;">Results</h3>
        </div>
        <div style="overflow-x: auto;">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody id="search-tbody"></tbody>
          </table>
        </div>
        <div class="pagination">
          <div class="pagination-info" id="search-pagination-info"></div>
        </div>
      </div>
    </div>
  `);

  const form = document.getElementById('search-form');
  const input = document.getElementById('search-input');
  const resultsDiv = document.getElementById('search-results');
  const tbody = document.getElementById('search-tbody');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    resultsDiv.style.display = 'block';
    tbody.innerHTML = '<tr><td colspan="4" class="loading"><div class="spinner"></div> Searching...</td></tr>';
    document.getElementById('search-pagination-info').textContent = '';

    try {
      const resp = await apiFetch(`/api/profiles/search?q=${encodeURIComponent(query)}`);
      const data = await resp.json();

      if (data.status !== 'success') throw new Error(data.message || 'Search failed');

      if (!data.data || data.data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="padding: 32px; text-align: center; color: var(--text-muted);">No profiles matched your query</td></tr>';
        return;
      }

      tbody.innerHTML = data.data.map(p => `
        <tr onclick="window.location.hash='#/profiles/${p.id}'">
          <td style="font-weight: 500;">${escapeHTML(p.name)}</td>
          <td><span class="badge badge-${p.gender}">${p.gender}</span></td>
          <td>${p.age} <span style="color: var(--text-muted); font-size: 0.8rem;">(${p.age_group})</span></td>
          <td>${escapeHTML(p.country_name)}</td>
        </tr>
      `).join('');

      document.getElementById('search-pagination-info').textContent = `Found ${data.total} matches`;

    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="4" style="padding: 24px; color: var(--danger);">${escapeHTML(err.message)}</td></tr>`;
    }
  });
}

function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.innerText = str;
  return div.innerHTML;
}
