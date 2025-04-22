
import React from 'react';

interface MapWarningMessageProps {
  mapboxLoads: number;
}

export const MapWarningMessage: React.FC<MapWarningMessageProps> = ({ mapboxLoads }) => (
  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-yellow-200 border border-yellow-500 text-yellow-800 rounded-lg px-6 py-3 z-20">
    <span className="font-bold">
      Approaching Mapbox free tier usage: {mapboxLoads.toLocaleString()} / 50,000 loads this month.
    </span>
    <br />
    <span>
      Refresh less often or consider upgrading your Mapbox plan.
    </span>
  </div>
);
