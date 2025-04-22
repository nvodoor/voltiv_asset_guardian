export const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;
export const MAPBOX_FREE_LIMIT = 50000;
export const MAPBOX_WARNING_THRESHOLD = 1000; // Threshold is 1000 loads remaining
export const MAPBOX_MONTH_KEY = "mapbox_loads_month";
export const MAPBOX_LOADS_KEY = "mapbox_loads_count";

// Add a key to track if map has been loaded already in this session
export const MAPBOX_SESSION_INITIALIZED = "mapbox_session_initialized";

export function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}`;
}

export function shouldInitializeMapbox() {
  // Only check if we've reached the limit
  const month = getCurrentMonth();
  if (localStorage.getItem(MAPBOX_MONTH_KEY) !== month) {
    localStorage.setItem(MAPBOX_MONTH_KEY, month);
    localStorage.setItem(MAPBOX_LOADS_KEY, "0");
    return true;
  }
  
  const count = parseInt(localStorage.getItem(MAPBOX_LOADS_KEY) || "0", 10);
  return count < MAPBOX_FREE_LIMIT;
}

// Reset session flag - can be called to force reinitialization if needed
export function resetMapboxSessionFlag() {
  sessionStorage.removeItem(MAPBOX_SESSION_INITIALIZED);
  console.log("Reset mapbox session initialization flag");
}

export function incrementMapboxLoads() {
  const month = getCurrentMonth();
  const localMonth = localStorage.getItem(MAPBOX_MONTH_KEY);
  
  // Mark session as initialized
  sessionStorage.setItem(MAPBOX_SESSION_INITIALIZED, "true");
  
  // Reset counter for new month
  if (localMonth !== month) {
    localStorage.setItem(MAPBOX_MONTH_KEY, month);
    localStorage.setItem(MAPBOX_LOADS_KEY, "1");
    console.log("New month detected, resetting mapbox load counter to 1");
    return 1;
  }
  
  // Increment counter for current month
  let count = parseInt(localStorage.getItem(MAPBOX_LOADS_KEY) || "0", 10) + 1;
  localStorage.setItem(MAPBOX_LOADS_KEY, count.toString());
  console.log(`Mapbox load count incremented to ${count}`);
  return count;
}

export function getMapboxLoads() {
  const month = getCurrentMonth();
  if (localStorage.getItem(MAPBOX_MONTH_KEY) !== month) {
    localStorage.setItem(MAPBOX_MONTH_KEY, month);
    localStorage.setItem(MAPBOX_LOADS_KEY, "0");
    return 0;
  }
  return parseInt(localStorage.getItem(MAPBOX_LOADS_KEY) || "0", 10);
}

// Improved utility to clean up markers and prevent memory leaks
export function clearAllMarkers(markers: { [id: string]: mapboxgl.Marker }) {
  if (!markers) return {};
  
  console.log(`Clearing ${Object.keys(markers).length} markers`);
  
  Object.values(markers).forEach(marker => {
    try {
      if (marker && typeof marker.remove === 'function') {
        marker.remove();
      }
    } catch (error) {
      console.error("Error removing marker:", error);
    }
  });
  
  return {};
}

export function shouldShowWarning() {
  const month = getCurrentMonth();
  if (localStorage.getItem(MAPBOX_MONTH_KEY) !== month) {
    return false;
  }
  
  const count = parseInt(localStorage.getItem(MAPBOX_LOADS_KEY) || "0", 10);
  // Only show warning when approaching the free tier limit (within MAPBOX_WARNING_THRESHOLD)
  return count >= (MAPBOX_FREE_LIMIT - MAPBOX_WARNING_THRESHOLD);
}

// Add function to check if coordinates are within valid range
export function isValidCoordinate(lng: number, lat: number): boolean {
  console.log({ lng, lat });
  return !isNaN(lng) && !isNaN(lat) && 
         lng >= -180 && lng <= 180 && 
         lat >= -90 && lat <= 90;
}
