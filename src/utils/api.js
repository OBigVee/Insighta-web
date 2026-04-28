const API_BASE = window.INSIGHTA_API_URL || 'https://stage1.doxantro.com';

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const token = localStorage.getItem('access_token');
  const headers = {
    'X-API-Version': '1',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // If 401, try to refresh
  if (response.status === 401) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      // Retry original request
      return fetch(url, {
        ...options,
        headers: {
          ...headers,
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
      });
    } else {
      // Redirect to login
      window.location.hash = '#/login';
      throw new Error('Session expired. Please log in again.');
    }
  }

  return response;
}

async function tryRefresh() {
  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) return false;

  try {
    const resp = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refresh }),
    });
    
    if (resp.ok) {
      const data = await resp.json();
      localStorage.setItem('access_token', data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function getApiBase() {
  return API_BASE;
}
