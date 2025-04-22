import React from 'react';
import mapboxgl from 'mapbox-gl';
import { Asset } from '../../../types';

interface MarkerCreatorProps {
  asset: Asset;
  map: mapboxgl.Map;
  onAssetSelect: (asset: Asset) => void;
}

export const createMarkerElement = (asset: Asset) => {
  const el = document.createElement('div');
  el.className = 'react-map-marker';
  
  // Add asset type class
  el.classList.add(`asset-${asset.asset_type}`);
  
  if (asset.asset_type === 'substation' || asset.asset_type === 'transformer') {
    el.classList.add('has-capacity-indicator');
    const capacityRing = document.createElement('div');
    capacityRing.className = 'capacity-ring';
    
    if (asset.grid_capacity) {
      capacityRing.classList.add(`constraint-${asset.grid_capacity.constraint_level}`);
    } else if (asset.risk_score) {
      const constraintLevel = asset.risk_score >= 0.8 ? 'critical' : 
                            asset.risk_score >= 0.6 ? 'high' : 
                            asset.risk_score >= 0.3 ? 'medium' : 'low';
      capacityRing.classList.add(`constraint-${constraintLevel}`);
    }
    
    el.appendChild(capacityRing);
  }

  if (asset.risk_score !== undefined) {
    if (asset.risk_score >= 0.8) {
      el.classList.add('risk-critical');
    } else if (asset.risk_score >= 0.6) {
      el.classList.add('risk-high');
    } else if (asset.risk_score >= 0.3) {
      el.classList.add('risk-medium');
    } else {
      el.classList.add('risk-low');
    }
  } else {
    el.classList.add('risk-low');
  }

  return el;
};

export const createMarkerPopup = (asset: Asset) => {
  let popupText = `${asset.asset_type.charAt(0).toUpperCase() + asset.asset_type.slice(1)} (${asset.id})`;
  
  if (asset.grid_capacity) {
    popupText += `\nCapacity: ${asset.grid_capacity.capacity_percentage}% (${asset.grid_capacity.constraint_level})`;
  }
  
  return new mapboxgl.Popup({ offset: 25 }).setText(popupText);
};

export const createMapMarker = ({ asset, map, onAssetSelect }: MarkerCreatorProps): mapboxgl.Marker | null => {
  try {
    // Strict coordinate validation to prevent markers from appearing off the globe
    if (!asset.longitude || !asset.latitude || 
        isNaN(asset.longitude) || isNaN(asset.latitude) ||
        asset.longitude < -180 || asset.longitude > 180 ||
        asset.latitude < -90 || asset.latitude > 90) {
      console.warn(`Skipping marker for asset ${asset.id} due to invalid coordinates:`, 
                  { lat: asset.latitude, lng: asset.longitude });
      return null;
    }

    const el = createMarkerElement(asset);
    const popup = createMarkerPopup(asset);

    // Create the marker with proper positioning
    const marker = new mapboxgl.Marker({
      element: el,
      anchor: 'bottom' 
    })
      .setLngLat([asset.longitude, asset.latitude])
      .setPopup(popup)
      .addTo(map);

    // Add click event listener
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      onAssetSelect(asset);
    });

    return marker;
  } catch (error) {
    console.error(`Error creating marker for asset ${asset.id}:`, error);
    return null;
  }
};
