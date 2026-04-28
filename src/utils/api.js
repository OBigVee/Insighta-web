const API_BASE = window.INSIGHTA_API_URL || 'https://stage1.doxantro.com';

function getCsrfToken() {
  const match = document.cookie.match(/csrf_token=([^;]+)/);
  return match ? match[1] : '';
}

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = {
    'X-API-Version': '1',
    ...options.headers,
  };

  // Add CSRF token for state-changing requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes((options.method || 'GET').toUpperCase())) {
    headers['X-CSRF-Token'] = getCsrfToken();
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Send cookies
  });

  // If 401, try to refresh
  if (response.status === 401) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      // Retry original request
      return fetch(url, {
        ...options,
        headers,
        credentials: 'include',
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
  try {
    const resp = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    return resp.ok;
  } catch {
    return false;
  }
}

export function getApiBase() {
  return API_BASE;
}
