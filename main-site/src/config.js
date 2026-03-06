const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Priority: 1. .env file 2. Localhost fallback 3. Production fallback
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001';
const PRODUCTION_FALLBACK = 'https://al-haq-backend-production.up.railway.app';

export let API_URL = BACKEND_URL;

/**
 * Automatically detect which port the backend server is running on (Local Dev Only)
 */
async function detectApiUrl() {
  // If we have an ENV variable or we are not in dev, use what we have
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (!isDevelopment) return PRODUCTION_FALLBACK;

  // Check localStorage for previously working URL
  const storedUrl = localStorage.getItem('api_url');
  if (storedUrl) {
    try {
      const response = await fetch(`${storedUrl}/api/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout(2000)
      });
      if (response.ok) {
        API_URL = storedUrl;
        return storedUrl;
      }
    } catch (e) {
      localStorage.removeItem('api_url');
    }
  }

  // Try each port until we find one that works
  for (const port of POSSIBLE_PORTS) {
    const url = `http://localhost:${port}`;
    try {
      const response = await fetch(`${url}/api/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout(2000)
      });
      
      if (response.ok) {
        localStorage.setItem('api_url', url);
        API_URL = url;
        return url;
      }
    } catch (e) {
      continue;
    }
  }

  API_URL = PRODUCTION_FALLBACK;
  return API_URL;
}

// Initialize API URL detection
export const API_URL_PROMISE = detectApiUrl();

// Update API_URL export after detection completes
API_URL_PROMISE.then(url => {
  API_URL = url;
});

export function getApiUrl() {
  return API_URL;
}

export async function apiFetch(endpoint, options = {}) {
  const baseUrl = await API_URL_PROMISE;
  const url = `${baseUrl}${endpoint}`;
  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    console.error(`❌ API Request failed:`, error.message);
    throw error;
  }
}

export const config = {
  get apiUrl() { return API_URL; },
  isDevelopment,
  apiFetch
};
