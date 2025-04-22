import { LngLat } from 'mapbox-gl';

export const webMercatorToLngLat = (x: number, y: number): LngLat => {
  // Convert Web Mercator coordinates to longitude/latitude
  const lng = (x / 20037508.34) * 180;
  const lat = (Math.atan(Math.exp((y / 20037508.34) * Math.PI)) * 360) / Math.PI - 90;
  
  return new LngLat(lng, lat);
}; 