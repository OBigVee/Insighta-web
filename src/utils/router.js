// Simple hash-based SPA router
export class Router {
  constructor(routes) {
    this.routes = routes;
    window.addEventListener('hashchange', () => this.resolve());
  }

  resolve() {
    const hash = window.location.hash.slice(1) || '/login';
    
    // Check for parameterized routes
    for (const [pattern, handler] of Object.entries(this.routes)) {
      const paramMatch = pattern.match(/^(.+)\/:(\w+)$/);
      if (paramMatch) {
        const [, base, paramName] = paramMatch;
        if (hash.startsWith(base + '/')) {
          const paramValue = hash.slice(base.length + 1);
          if (paramValue) {
            handler({ [paramName]: paramValue });
            return;
          }
        }
      }
    }

    // Exact match
    const handler = this.routes[hash];
    if (handler) {
      handler();
    } else {
      // Default to login
      window.location.hash = '#/login';
    }
  }

  start() {
    this.resolve();
  }
}

export function navigate(path) {
  window.location.hash = '#' + path;
}
