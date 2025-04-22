
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { PalmettoHouse, PGESubstation } from '@/types/palmetto';
import { findNearestSubstation } from '../utils/substationUtils';

interface HouseMarkersProps {
  map: mapboxgl.Map;
  houses: PalmettoHouse[];
  markers: { [id: string]: mapboxgl.Marker };
  markersRendered: { [id: string]: boolean };
  substations: PGESubstation[];
}

export const HouseMarkers: React.FC<HouseMarkersProps> = ({
  map,
  houses,
  markers,
  markersRendered,
  substations,
}) => {
  useEffect(() => {
    houses.forEach(house => {
      if (!house.latitude || !house.longitude || 
          isNaN(house.latitude) || isNaN(house.longitude) ||
          house.longitude < -180 || house.longitude > 180 ||
          house.latitude < -90 || house.latitude > 90) {
        return;
      }
      
      const markerId = `palmetto-${house.id}`;
      if (markersRendered[markerId]) return;

      const nearestSubstation = findNearestSubstation(house, substations);
      
      const el = document.createElement('div');
      el.className = 'house-marker';
      el.dataset.houseId = house.id;
      
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
      })
        .setLngLat([house.longitude, house.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div class="p-4 z-10">
              <h3 class="text-lg font-semibold">${house.palmetto_system_id}</h3>
              <p>System Size: ${house.system_size_kw ? house.system_size_kw.toFixed(1) + ' kW' : 'N/A'}</p>
              <p>Annual Production: ${house.annual_production_kwh ? house.annual_production_kwh.toLocaleString() + ' kWh' : 'N/A'}</p>
              <p>Install Date: ${house.install_date ? new Date(house.install_date).toLocaleDateString() : 'N/A'}</p>
              ${nearestSubstation ? `<p class="mt-2 text-sm text-gray-600">Nearest Substation: ${nearestSubstation.substation_name}</p>` : ''}
            </div>`
          )
        )
        .addTo(map);

      markers[markerId] = marker;
      markersRendered[markerId] = true;
    });
  }, [houses, map, markers, markersRendered, substations]);

  return null;
};
