import { apiFetch, getApiBase } from '../utils/api.js';
import { renderLayout } from '../main.js';

let currentPage = 1;
let currentLimit = 10;
let currentFilters = {};

export async function renderProfiles(app) {
  renderLayout(app, 'profiles', `
    <div class="page-header">
      <h1>Profiles</h1>
      <p>Browse and filter the intelligence database</p>
    </div>

    <div class="table-container">
      <div class="table-toolbar">
        <select id="filter-gender" class="filter-select">
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input type="text" id="filter-country" class="filter-input" placeholder="Country Code (e.g. NG)" />
        <select id="filter-age" class="filter-select">
          <option value="">All Ages</option>
          <option value="child">Child</option>
          <option value="teenager">Teenager</option>
          <option value="adult">Adult</option>
          <option value="senior">Senior</option>
        </select>
        <button id="btn-apply-filters" class="btn-page">Apply</button>
        <button id="btn-export" class="btn-page" style="margin-left: auto;">Export CSV</button>
      </div>

      <div style="overflow-x: auto;">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Group</th>
              <th>Country</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody id="profiles-tbody">
            <tr><td colspan="6" class="loading"><div class="spinner"></div> Loading profiles...</td></tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <div class="pagination-info" id="pagination-info">Showing 0 results</div>
        <div class="pagination-buttons">
          <button id="btn-prev" class="btn-page" disabled>Previous</button>
          <button id="btn-next" class="btn-page" disabled>Next</button>
        </div>
      </div>
    </div>
  `);

  document.getElementById('btn-apply-filters').addEventListener('click', () => {
    currentFilters.gender = document.getElementById('filter-gender').value;
    currentFilters.country_id = document.getElementById('filter-country').value;
    currentFilters.age_group = document.getElementById('filter-age').value;
    currentPage = 1;
    loadProfiles();
  });

  document.getElementById('btn-export').addEventListener('click', async () => {
    try {
      const btn = document.getElementById('btn-export');
      btn.textContent = 'Exporting...';
      btn.disabled = true;

      const params = new URLSearchParams({ format: 'csv', ...currentFilters });
      const resp = await apiFetch(`/api/profiles/export?${params}`);
      
      if (!resp.ok) {
        throw new Error('Export failed with status ' + resp.status);
      }
      
      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'profiles_export.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      btn.textContent = 'Export CSV';
      btn.disabled = false;
    } catch (e) {
      alert('Export failed: ' + e.message);
      const btn = document.getElementById('btn-export');
      btn.textContent = 'Export CSV';
      btn.disabled = false;
    }
  });

  document.getElementById('btn-prev').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      loadProfiles();
    }
  });

  document.getElementById('btn-next').addEventListener('click', () => {
    currentPage++;
    loadProfiles();
  });

  // Restore previous filters if any
  document.getElementById('filter-gender').value = currentFilters.gender || '';
  document.getElementById('filter-country').value = currentFilters.country_id || '';
  document.getElementById('filter-age').value = currentFilters.age_group || '';

  loadProfiles();
}

async function loadProfiles() {
  const tbody = document.getElementById('profiles-tbody');
  tbody.innerHTML = '<tr><td colspan="6" class="loading"><div class="spinner"></div> Loading profiles...</td></tr>';

  try {
    const params = new URLSearchParams({
      page: currentPage,
      limit: currentLimit,
      ...currentFilters,
    });

    const resp = await apiFetch(`/api/profiles?${params}`);
    const data = await resp.json();

    if (data.status !== 'success') throw new Error(data.message || 'Failed to load');

    if (!data.data || data.data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="padding: 32px; text-align: center; color: var(--text-muted);">No profiles found</td></tr>';
      updatePagination(data);
      return;
    }

    tbody.innerHTML = data.data.map(p => `
      <tr onclick="window.location.hash='#/profiles/${p.id}'">
        <td style="font-weight: 500;">${escapeHTML(p.name)}</td>
        <td><span class="badge badge-${p.gender}">${p.gender}</span></td>
        <td>${p.age}</td>
        <td style="text-transform: capitalize;">${p.age_group}</td>
        <td>${escapeHTML(p.country_name)}</td>
        <td style="color: var(--text-muted); font-size: 0.8rem;">${new Date(p.created_at).toLocaleDateString()}</td>
      </tr>
    `).join('');

    updatePagination(data);
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" style="padding: 24px; color: var(--danger);">${escapeHTML(err.message)}</td></tr>`;
  }
}

function updatePagination(data) {
  document.getElementById('pagination-info').textContent = 
    `Page ${data.page} of ${data.total_pages} (Total: ${data.total})`;
  
  document.getElementById('btn-prev').disabled = !data.links?.prev;
  document.getElementById('btn-next').disabled = !data.links?.next;
  currentPage = data.page;
}

function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.innerText = str;
  return div.innerHTML;
}
