
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { 
  MAPBOX_TOKEN, 
  MAPBOX_FREE_LIMIT, 
  getMapboxLoads, 
  incrementMapboxLoads, 
  shouldInitializeMapbox, 
  shouldShowWarning,
  resetMapboxSessionFlag
} from '../mapUtils';

export const useMapInitialization = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [id: string]: mapboxgl.Marker }>({});
  const [mapInitialized, setMapInitialized] = useState(false);
  const [mapboxToken, setMapboxToken] = useState(MAPBOX_TOKEN);
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [mapboxLoads, setMapboxLoads] = useState(0);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  
  // More robust tracking of map initialization
  const mapInitAttempted = useRef(false);
  const mapInitializedInSession = useRef(false);
  const initTimeoutRef = useRef<number | null>(null);

  // Force reset the session flag when the component mounts
  useEffect(() => {
    if (!mapInitialized && !mapInitializedInSession.current) {
      // Reset the session flag to force reinitialization
      resetMapboxSessionFlag();
    }
    
    const loads = getMapboxLoads();
    setMapboxLoads(loads);
    setShowLimitWarning(shouldShowWarning());
    
    // Cleanup function to clear any pending timeout
    return () => {
      if (initTimeoutRef.current !== null) {
        window.clearTimeout(initTimeoutRef.current);
      }
    };
  }, [mapInitialized]);

  useEffect(() => {
    // For debugging
    console.log("Map initialization status:", {
      mapInitialized,
      mapInitializedInSession: mapInitializedInSession.current,
      mapInitAttempted: mapInitAttempted.current,
      containerExists: !!mapContainer.current,
      tokenExists: !!mapboxToken
    });
    
    // Early return conditions
    if (mapInitializedInSession.current || 
        mapInitAttempted.current || 
        !mapContainer.current || 
        !mapboxToken) {
      return;
    }
    
    // Check if map initialization is allowed - only check usage limits, not session
    if (getMapboxLoads() >= MAPBOX_FREE_LIMIT) {
      console.log("Usage limit reached");
      setMapboxLoads(getMapboxLoads());
      setShowLimitWarning(shouldShowWarning());
      return;
    }

    mapInitAttempted.current = true;
    console.log("Attempting to initialize Mapbox map...");
    
    // Clear any existing timeout
    if (initTimeoutRef.current !== null) {
      window.clearTimeout(initTimeoutRef.current);
    }
    
    initTimeoutRef.current = window.setTimeout(() => {
      try {
        console.log("Initializing Mapbox map...");
        mapboxgl.accessToken = mapboxToken;
        
        const newCount = incrementMapboxLoads();
        setMapboxLoads(newCount);
        
        // Check usage limit
        if (newCount >= MAPBOX_FREE_LIMIT) {
          console.log("Mapbox usage limit reached");
          setShowLimitWarning(true);
          mapInitAttempted.current = false;
          return;
        }
        
        // Remove existing map if it exists
        if (map.current) {
          console.log("Removing existing map instance");
          Object.values(markers.current).forEach(marker => marker.remove());
          markers.current = {};
          map.current.remove();
          map.current = null;
        }
        
        // Create new map instance with max bounds to prevent dragging too far
        console.log("Creating new map instance");
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [-122.4194, 37.7749],
          zoom: 12,
          maxBounds: [[-270, -85], [270, 85]], // Restrict map panning to realistic bounds
          renderWorldCopies: false // Prevent duplicate markers when panning beyond edges
        });
        
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-right');
        
        map.current.on('load', () => {
          console.log('Map loaded successfully');
          mapInitializedInSession.current = true;
          setMapInitialized(true);
          mapInitAttempted.current = false;
        });
        
        // Handle error if the map doesn't load within 5 seconds
        setTimeout(() => {
          if (!mapInitializedInSession.current) {
            console.warn("Map initialization timeout - map did not load within 5 seconds");
            setShowTokenInput(true);
            mapInitAttempted.current = false;
          }
        }, 5000);
        
      } catch (error) {
        console.error("Error initializing map:", error);
        setShowTokenInput(true);
        mapInitAttempted.current = false;
      }
    }, 300);

    return () => {
      // Cleanup function to remove map and markers
      if (initTimeoutRef.current !== null) {
        window.clearTimeout(initTimeoutRef.current);
      }
      
      if (map.current) {
        Object.values(markers.current).forEach(marker => marker.remove());
        markers.current = {};
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken]);

  return {
    mapContainer,
    map,
    markers,
    mapInitialized,
    mapboxToken,
    showTokenInput,
    setShowTokenInput,
    setMapboxToken,
    mapboxLoads,
    showLimitWarning,
    resetMapSession: resetMapboxSessionFlag
  };
};
