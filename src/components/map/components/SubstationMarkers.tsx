
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { PGESubstation } from '@/types/palmetto';
import { isValidCoordinate } from '../mapUtils';

interface SubstationMarkersProps {
  map: mapboxgl.Map;
  substations: PGESubstation[];
  markers: { [id: string]: mapboxgl.Marker };
  markersRendered: { [id: string]: boolean };
}

export const SubstationMarkers: React.FC<SubstationMarkersProps> = ({
  map,
  substations,
  markers,
  markersRendered,
}) => {
  useEffect(() => {
    if (!substations || substations.length === 0) {
      console.log('No PG&E substations data available for rendering');
      return;
    }

    console.log(`Rendering ${substations.length} PG&E substations`);
    
    substations.forEach(substation => {
      // Skip if invalid coordinates
      if (!isValidCoordinate(substation.longitude, substation.latitude)) {
        console.warn(`Skipping substation with invalid coordinates:`, substation);
        return;
      }
      
      // Use substation_name for marker ID to ensure unique identification
      const markerId = `pge-substation-${substation.substation_name?.replace(/\s+/g, '-').toLowerCase() || substation.objectid}`;
      
      // Skip if this marker was already rendered
      if (markersRendered[markerId]) return;
      
      // Log actual coordinates being used
      console.log(`Adding marker for ${substation.substation_name || 'Unknown'} at [${substation.longitude}, ${substation.latitude}]`);
      
      // Create marker element
      const el = document.createElement('div');
      el.className = 'substation-marker';
      el.dataset.substationId = substation.objectid.toString();
      
      // Create the marker with popup
      // Fixed: Ensure coordinates are properly passed as LngLatLike by creating a proper [lng, lat] tuple
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
      })
        .setLngLat([substation.longitude, substation.latitude]) // Explicitly create a tuple with 2 elements
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div class="p-4">
              <h3 class="text-lg font-semibold">${substation.substation_name || 'PG&E Substation'}</h3>
              <p>Existing Generation: ${substation.existing_distributed_generation_kw?.toLocaleString() || 'N/A'} kW</p>
              <p>Queued Generation: ${substation.queued_distributed_generation_kw?.toLocaleString() || 'N/A'} kW</p>
              <p>Total Generation: ${substation.total_distributed_generation_kw?.toLocaleString() || 'N/A'} kW</p>
              <p>Last Updated: ${substation.last_update_on_map || 'N/A'}</p>
              <p>Coordinates: [${substation.longitude.toFixed(5)}, ${substation.latitude.toFixed(5)}]</p>
            </div>`
          )
        )
        .addTo(map);

      markers[markerId] = marker;
      markersRendered[markerId] = true;
    });
    
    return () => {
      // Clean up handled by useMarkerCleanup
    };
  }, [substations, map, markers, markersRendered]);

  return null;
};
