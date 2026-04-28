# Insighta Labs+ Web Portal

A premium, dark-mode single-page application (SPA) for visualizing and exploring the [Insighta Labs+](https://github.com/OBigVee/data-and-API) Profile Intelligence System.

## Features
- **Secure Authentication**: Integrates with the backend using HttpOnly cookies and CSRF protection.
- **Dynamic Dashboards**: View dataset-wide statistics and metrics.
- **Profile Explorer**: Filter, sort, and paginate through intelligence profiles.
- **Natural Language Search**: Query the database using conversational phrases (e.g., "young men").
- **Dark Mode Aesthetics**: Built with Vanilla JS, Vite, and custom CSS variables for a fluid, dynamic interface.

## Quick Start

### Prerequisites
- Node.js (v20+)
- The Insighta Backend server running locally or in production.

### Setup
```bash
# Clone the repository
git clone <your-web-repo-url>
cd insighta-web

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Configuration
By default, the application is configured to point to `https://stage1.doxantro.com` for the API. 
If you are running the backend locally on port 8080, you can update `API_BASE` in `src/utils/api.js` to `http://localhost:8080`.

## Scripts
- `npm run dev` - Starts the Vite development server.
- `npm run build` - Compiles the SPA into the `/dist` directory for production deployment.
- `npm run preview` - Previews the production build locally.
