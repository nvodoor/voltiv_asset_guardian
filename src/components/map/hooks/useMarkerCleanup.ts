
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { clearAllMarkers } from '../mapUtils';

interface UseMarkerCleanupProps {
  map: mapboxgl.Map | null;
  markers: React.MutableRefObject<{ [id: string]: mapboxgl.Marker }>;
  markersCreated: React.MutableRefObject<boolean>;
  connectionLayers: React.MutableRefObject<string[]>;
}

export const useMarkerCleanup = ({
  map,
  markers,
  markersCreated,
  connectionLayers,
}: UseMarkerCleanupProps) => {
  // Clean up on map style or zoom change to prevent marker duplication
  useEffect(() => {
    if (!map) return;
    
    const handleZoomEnd = () => {
      const zoom = map.getZoom();
      // Only show markers when zoomed in enough to avoid cluttering at world view
      if (zoom < 2) {
        // Hide markers temporarily at very low zoom levels
        Object.values(markers.current).forEach(marker => {
          const element = marker.getElement();
          if (element) {
            element.style.visibility = 'hidden';
          }
        });
      } else {
        // Show markers again when zoomed back in
        Object.values(markers.current).forEach(marker => {
          const element = marker.getElement();
          if (element) {
            element.style.visibility = 'visible';
          }
        });
      }
    };
    
    // Add zoom event listener
    map.on('zoomend', handleZoomEnd);
    
    // Initialize visibility based on current zoom
    handleZoomEnd();
    
    return () => {
      // Remove event listener on cleanup
      if (map) {
        map.off('zoomend', handleZoomEnd);
      }
    };
  }, [map, markers]);
  
  // Complete cleanup on component unmount
  useEffect(() => {
    return () => {
      clearAllMarkers(markers.current);
      markers.current = {};
      markersCreated.current = false;
      
      // Clean up connection layers
      if (map && connectionLayers.current.length > 0) {
        connectionLayers.current.forEach(layerId => {
          try {
            if (map.getStyle() && map.getLayer(layerId)) {
              map.removeLayer(layerId);
            }
            if (map.getStyle() && map.getSource(layerId)) {
              map.removeSource(layerId);
            }
          } catch (error) {
            console.warn(`Error cleaning up layer ${layerId}:`, error);
          }
        });
      }
    };
  }, [markers, map, markersCreated, connectionLayers]);
};
