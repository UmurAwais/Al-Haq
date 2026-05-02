const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Priority: 1. .env file 2. Localhost fallback 3. Production fallback
const PRODUCTION_FALLBACK = 'https://al-haq-backend.vercel.app';
const BACKEND_URL = import.meta.env.VITE_API_URL || (isDevelopment ? 'http://localhost:4001' : PRODUCTION_FALLBACK);

export let API_URL = BACKEND_URL;

const POSSIBLE_PORTS = [3000, 4001, 5000, 8080];

/**
 * Automatically detect which port the backend server is running on (Local Dev Only)
 */
async function detectApiUrl() {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (!isDevelopment) return PRODUCTION_FALLBACK;

  const storedUrl = localStorage.getItem('api_url');
  
  const checkUrl = async (url) => {
    try {
      const response = await fetch(`${url}/api/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout ? AbortSignal.timeout(2000) : undefined
      });
      if (response.ok) return url;
      throw new Error('Not ok');
    } catch (e) {
      throw e;
    }
  };

  try {
    // If we have a stored URL, try that first as it's the most likely candidate
    if (storedUrl) {
      try {
        const url = await checkUrl(storedUrl);
        API_URL = url;
        return url;
      } catch (e) {
        localStorage.removeItem('api_url');
      }
    }

    // Try all ports in parallel with a race to find the first working one
    const detectionPromise = Promise.any(POSSIBLE_PORTS.map(port => checkUrl(`http://localhost:${port}`)));
    
    // Global timeout of 3 seconds for the entire detection process
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Detection Timeout')), 3000));

    const fastestUrl = await Promise.race([detectionPromise, timeoutPromise]);
    
    localStorage.setItem('api_url', fastestUrl);
    API_URL = fastestUrl;
    return fastestUrl;
  } catch (error) {
    // If all fail or timeout happened
    console.warn('Backend detection failed, using production fallback.');
    API_URL = PRODUCTION_FALLBACK;
    return PRODUCTION_FALLBACK;
  }
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
