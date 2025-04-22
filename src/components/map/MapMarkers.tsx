
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Asset, AssetFilters } from '../../types';
import { filterAssets } from './utils/filterAssets';
import { createMapMarker } from './components/MarkerCreator';
import { usePalmettoHouses } from '@/hooks/usePalmettoHouses';
import { useMarkerCleanup } from './hooks/useMarkerCleanup';
import { HouseMarkers } from './components/HouseMarkers';
import { SubstationMarkers } from './components/SubstationMarkers';
import { MapBounds } from './components/MapBounds';
import { usePGESubstations } from '@/hooks/usePGESubstations';

interface MapMarkersProps {
  map: mapboxgl.Map | null;
  mapInitialized: boolean;
  assets: Asset[];
  filters: AssetFilters;
  onAssetSelect: (asset: Asset) => void;
  markers: React.MutableRefObject<{ [id: string]: mapboxgl.Marker }>;
}

const MapMarkers: React.FC<MapMarkersProps> = ({
  map,
  mapInitialized,
  assets,
  filters,
  onAssetSelect,
  markers,
}) => {
  const markersCreated = useRef(false);
  const [markersStable, setMarkersStable] = useState(false);
  const { data: palmettoData } = usePalmettoHouses();
  const { data: pgeSubstations = [], isLoading: pgeLoading, error: pgeError } = usePGESubstations();
  
  // Remove references to connection layers and highlighted substation
  const connectionLayers = useRef<string[]>([]);
  
  // Track whether markers have been rendered in this session
  const markersRendered = useRef<{[id: string]: boolean}>({});

  // Log data for debugging
  useEffect(() => {
    if (pgeSubstations.length) {
      console.log(`PG&E substations loaded: ${pgeSubstations.length}`);
      console.log('First PG&E substation sample:', pgeSubstations[0]);
    }
    
    if (pgeLoading) {
      console.log('Loading PG&E substations...');
    }
    
    if (pgeError) {
      console.error('Error loading PG&E substations:', pgeError);
    }
  }, [pgeSubstations, pgeLoading, pgeError]);

  // Use the cleanup hook with more comprehensive cleanup
  useMarkerCleanup({ map, markers, markersCreated, connectionLayers });

  // Handle filter changes by recreating markers
  useEffect(() => {
    if (!map || !mapInitialized) return;
    
    // Reset marker creation flags when filters change
    markersCreated.current = false;
    markersRendered.current = {};
    setMarkersStable(false);
  }, [filters, mapInitialized]);

  // Create or update markers for filtered assets
  useEffect(() => {
    if (!map || !mapInitialized || markersCreated.current || !palmettoData) return;

    // Clear existing markers
    Object.values(markers.current).forEach(marker => marker.remove());
    markers.current = {};
    markersRendered.current = {};

    // Create markers for regular assets
    const filteredAssets = filterAssets(assets, filters);
    filteredAssets.forEach(asset => {
      // Skip if invalid coordinates or already created
      if (!asset.longitude || !asset.latitude || 
          isNaN(asset.longitude) || isNaN(asset.latitude) ||
          asset.longitude < -180 || asset.longitude > 180 ||
          asset.latitude < -90 || asset.latitude > 90) {
        return;
      }
      
      const markerId = `asset-${asset.id}`;
      if (markersRendered.current[markerId]) return;
      
      const marker = createMapMarker({ asset, map, onAssetSelect });
      if (marker) {
        markers.current[markerId] = marker;
        markersRendered.current[markerId] = true;
      }
    });

    markersCreated.current = true;
    setMarkersStable(true);
  }, [assets, filters, mapInitialized, map, onAssetSelect, markers, palmettoData]);

  if (!map || !mapInitialized || !palmettoData || !markersStable) {
    return null;
  }

  return (
    <>
      <HouseMarkers
        map={map}
        houses={palmettoData.houses}
        markers={markers.current}
        markersRendered={markersRendered.current}
        substations={pgeSubstations} // Pass substations to HouseMarkers
      />
      {pgeSubstations && pgeSubstations.length > 0 && (
        <SubstationMarkers
          map={map}
          substations={pgeSubstations}
          markers={markers.current}
          markersRendered={markersRendered.current}
        />
      )}
      <MapBounds
        map={map}
        assets={assets}
        houses={palmettoData.houses}
        substations={[]}
        pgeSubstations={pgeSubstations}
      />
    </>
  );
};

export default MapMarkers;
