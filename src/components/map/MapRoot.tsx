
import React, { useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import './map.css'; // Import our custom map styles
import { Asset, AssetFilters } from '../../types';
import MapMarkers from './MapMarkers';
import MapTokenInput from './MapTokenInput';
import { MapLoadingState } from './components/MapLoadingState';
import { MapWarningMessage } from './components/MapWarningMessage';
import { useMapInitialization } from './hooks/useMapInitialization';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { usePalmettoHouses } from '@/hooks/usePalmettoHouses';
import { PGESubstation } from '@/types/palmetto';
import SubstationSummary from './components/SubstationSummary';
import { usePGESubstations } from '@/hooks/usePGESubstations';

const MapRoot: React.FC<{
  assets: Asset[];
  filters: AssetFilters;
  onAssetSelect: (asset: Asset) => void;
}> = ({ assets, filters, onAssetSelect }) => {
  const {
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
    resetMapSession
  } = useMapInitialization();

  const { data: palmettoData } = usePalmettoHouses();
  const { data: pgeSubstations = [] } = usePGESubstations();
  const [selectedSubstation, setSelectedSubstation] = useState<PGESubstation | null>(null);

  useEffect(() => {
    console.log('MapRoot rendered:', { 
      mapInitialized, 
      showTokenInput, 
      showLimitWarning,
      pgeSubstationsCount: pgeSubstations?.length 
    });
  }, [mapInitialized, showTokenInput, showLimitWarning, pgeSubstations]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowTokenInput(false);
  };

  const handleForceReinitialize = () => {
    resetMapSession();
    window.location.reload();
  };

  useEffect(() => {
    if (!map.current || !mapInitialized) return;

    // Add click handler for substation markers
    const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
      // If we clicked on the map (not a marker), clear the selection
      if (e.originalEvent.target === mapContainer.current) {
        setSelectedSubstation(null);
      }
    };

    map.current.on('click', handleMapClick);

    return () => {
      if (map.current) {
        map.current.off('click', handleMapClick);
      }
    };
  }, [map, mapInitialized, mapContainer]);

  useEffect(() => {
    // Listen for click events on substation markers
    const handleSubstationClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const substationMarker = target.closest('.substation-marker') as HTMLElement;
      
      if (substationMarker && pgeSubstations.length) {
        const substationId = substationMarker.dataset.substationId;
        if (substationId) {
          const substation = pgeSubstations.find(s => s.objectid.toString() === substationId);
          if (substation) {
            console.log('Selected substation:', substation);
            setSelectedSubstation(prev => 
              prev && prev.objectid.toString() === substationId ? null : substation
            );
          }
        }
      }
    };

    document.addEventListener('click', handleSubstationClick);

    return () => {
      document.removeEventListener('click', handleSubstationClick);
    };
  }, [pgeSubstations]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100">
      {showTokenInput && (
        <MapTokenInput
          token={mapboxToken}
          onTokenChange={setMapboxToken}
          onTokenSubmit={handleTokenSubmit}
        />
      )}

      {showLimitWarning && (
        <MapWarningMessage mapboxLoads={mapboxLoads} />
      )}

      <div ref={mapContainer} className="w-full h-full" />

      {!mapInitialized && !showTokenInput && !showLimitWarning && (
        <MapLoadingState />
      )}

      {!mapInitialized && !showTokenInput && !showLimitWarning && (
        <div className="absolute bottom-4 right-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleForceReinitialize}
            className="bg-white"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reload Map
          </Button>
        </div>
      )}

      {mapInitialized && map.current && (
        <MapMarkers
          map={map.current}
          mapInitialized={mapInitialized}
          assets={assets}
          filters={filters}
          onAssetSelect={onAssetSelect}
          markers={markers}
        />
      )}
    </div>
  );
};

export default MapRoot;
