export function renderAuthCallback(app) {
  app.innerHTML = '<div class="loading" style="display:flex;justify-content:center;align-items:center;height:100vh;color:white;font-size:24px;">Authenticating...</div>';
  
  const hash = window.location.hash;
  const parts = hash.split('?');
  if (parts.length > 1) {
    const params = new URLSearchParams(parts[1]);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    
    if (accessToken && refreshToken) {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    }
  }
  
  window.location.hash = '#/dashboard';
}
