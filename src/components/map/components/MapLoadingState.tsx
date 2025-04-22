
import React from 'react';

export const MapLoadingState: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
    <div className="flex items-center space-x-2">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
      <span>Loading map...</span>
    </div>
  </div>
);
