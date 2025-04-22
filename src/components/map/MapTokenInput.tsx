
import React from 'react';
import { Button } from '@/components/ui/button';

interface MapTokenInputProps {
  token: string;
  onTokenChange: (value: string) => void;
  onTokenSubmit: (e: React.FormEvent) => void;
}

const MapTokenInput: React.FC<MapTokenInputProps> = ({ token, onTokenChange, onTokenSubmit }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10 p-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Mapbox Token Required</h3>
        <p className="mb-4 text-sm text-gray-600">
          To view the map, please enter your Mapbox public token.
          You can get one from{' '}
          <a
            href="https://mapbox.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            mapbox.com
          </a>
        </p>
        <form onSubmit={onTokenSubmit} className="space-y-4">
          <input
            type="text"
            value={token}
            onChange={(e) => onTokenChange(e.target.value)}
            placeholder="pk.eyJ1IjoieW91..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit" disabled={!token} className="w-full">
            Set Token
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MapTokenInput;
