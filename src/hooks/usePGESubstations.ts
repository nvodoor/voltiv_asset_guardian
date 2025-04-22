
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PGESubstation } from "@/types/palmetto";

// Convert Web Mercator coordinates (EPSG:3857) to latitude/longitude (EPSG:4326)
function webMercatorToLatLong(mercatorX: number, mercatorY: number): [number, number] {
  // Constants for Web Mercator projection
  const earthRadius = 6378137.0; // Earth's radius in meters
  const halfCircumference = Math.PI * earthRadius;
  const mercatorXToLongitude = 180 / halfCircumference;
  
  // Convert X to longitude (degrees)
  const longitude = mercatorX * mercatorXToLongitude;
  
  // Convert Y to latitude (degrees)
  const latRad = Math.atan(Math.sinh(mercatorY / earthRadius));
  const latitude = latRad * (180 / Math.PI);
  
  // Ensure we're returning a proper tuple with exactly 2 elements
  return [longitude, latitude];
}

export const usePGESubstations = () => {
  return useQuery({
    queryKey: ['pge-substations'],
    queryFn: async () => {
      try {
        const { data: substations, error } = await supabase
          .from('pg_e_substations')
          .select('*')
          .filter('x', 'not.is', null)
          .filter('y', 'not.is', null);
        
        if (error) throw error;
        
        console.log('Fetched PG&E substations:', substations?.length || 0);
        
        // Transform coordinates from Web Mercator to latitude/longitude
        const transformedSubstations = substations.map(sub => {
          // Convert coordinates using our helper function - it returns a tuple of [longitude, latitude]
          const [longitude, latitude] = webMercatorToLatLong(sub.x, sub.y);
          
          // Log each conversion for debugging
          console.log(`Converting coordinates for ${sub.substation_name || 'Unnamed'}:`, {
            original: { x: sub.x, y: sub.y },
            converted: { longitude, latitude }
          });
          
          // Return a new object with the original data plus the converted coordinates
          return {
            ...sub,
            longitude,
            latitude
          };
        });
        
        return transformedSubstations as PGESubstation[];
      } catch (error) {
        console.error('Error fetching PG&E substations:', error);
        throw error;
      }
    }
  });
};
