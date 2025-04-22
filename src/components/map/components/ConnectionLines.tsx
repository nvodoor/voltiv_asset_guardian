
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { PalmettoHouse, Substation, HouseConnection } from '@/types/palmetto';

interface ConnectionLinesProps {
  map: mapboxgl.Map;
  connections: HouseConnection[];
  houses: PalmettoHouse[];
  substations: Substation[];
  highlightedSubstationId: string | null;
  connectionLayers: React.MutableRefObject<string[]>;
}

export const ConnectionLines: React.FC<ConnectionLinesProps> = ({
  map,
  connections,
  houses,
  substations,
  highlightedSubstationId,
  connectionLayers,
}) => {
  useEffect(() => {
    // Clear previous connection layers
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
    connectionLayers.current = [];

    // Create new connection lines
    connections.forEach(connection => {
      const house = houses.find(h => h.id === connection.house_id);
      const substation = substations.find(s => s.id === connection.substation_id);
      
      if (house && substation) {
        const layerId = `connection-${connection.id}`;
        connectionLayers.current.push(layerId);
        
        try {
          map.addSource(layerId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: [
                  [house.longitude, house.latitude],
                  [substation.longitude, substation.latitude]
                ]
              },
              properties: {
                distance: connection.distance_miles,
                substation_id: substation.id,
                house_id: house.id
              }
            }
          });

          map.addLayer({
            id: layerId,
            type: 'line',
            source: layerId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': highlightedSubstationId === substation.id ? '#3b82f6' : '#888',
              'line-width': highlightedSubstationId === substation.id ? 3 : 2,
              'line-opacity': highlightedSubstationId === substation.id ? 0.9 : 
                            highlightedSubstationId ? 0.2 : 0.6,
              'line-dasharray': [2, 1]
            }
          });
        } catch (error) {
          console.warn(`Error adding connection line for house ${house.id} to substation ${substation.id}:`, error);
        }
      }
    });
  }, [map, connections, houses, substations, highlightedSubstationId]);

  return null;
};
