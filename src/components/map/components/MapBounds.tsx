
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Asset } from '@/types';
import { PalmettoHouse, Substation, PGESubstation } from '@/types/palmetto';

interface MapBoundsProps {
  map: mapboxgl.Map;
  assets: Asset[];
  houses: PalmettoHouse[];
  substations: Substation[];
  pgeSubstations?: PGESubstation[];
}

export const MapBounds: React.FC<MapBoundsProps> = ({
  map,
  assets,
  houses,
  substations,
  pgeSubstations = []
}) => {
  useEffect(() => {
    try {
      const bounds = new mapboxgl.LngLatBounds();
      let hasBounds = false;

      // Add all points to bounds
      [...assets, ...houses, ...substations].forEach(point => {
        if (point.longitude && point.latitude && 
            !isNaN(point.longitude) && !isNaN(point.latitude) &&
            point.longitude >= -180 && point.longitude <= 180 &&
            point.latitude >= -90 && point.latitude <= 90) {
          bounds.extend([point.longitude, point.latitude]);
          hasBounds = true;
        }
      });

      // Add PG&E substations to bounds if they exist
      if (pgeSubstations && pgeSubstations.length > 0) {
        pgeSubstations.forEach(substation => {
          if (substation.longitude && substation.latitude && 
              !isNaN(substation.longitude) && !isNaN(substation.latitude) &&
              substation.longitude >= -180 && substation.longitude <= 180 &&
              substation.latitude >= -90 && substation.latitude <= 90) {
            bounds.extend([substation.longitude, substation.latitude]);
            hasBounds = true;
          }
        });
      }

      if (hasBounds && !bounds.isEmpty()) {
        map.fitBounds(bounds, {
          padding: 100,
          maxZoom: 15
        });
      }
    } catch (error) {
      console.error("Error fitting bounds:", error);
    }
  }, [map, assets, houses, substations, pgeSubstations]);

  return null;
};
