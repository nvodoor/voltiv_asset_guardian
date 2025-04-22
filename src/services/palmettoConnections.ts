
import { supabase } from "@/integrations/supabase/client";
import { PalmettoHouse, Substation, HouseConnection } from "@/types/palmetto";
import { calculateDistance } from "@/utils/distance";

export async function assignHousesToSubstations(
  houses: PalmettoHouse[], 
  substations: Substation[]
): Promise<HouseConnection[]> {
  const connections: HouseConnection[] = [];
  const MAX_DISTANCE = 2; // Maximum connection distance in miles
  
  // First delete existing connections to avoid duplicates
  await supabase.from('house_connections').delete().neq('id', '0');
  
  for (const house of houses) {
    let minDistance = Number.MAX_VALUE;
    let nearestSubstation: Substation | null = null;
    
    for (const substation of substations) {
      const distance = calculateDistance(
        house.latitude, 
        house.longitude, 
        substation.latitude, 
        substation.longitude
      );
      
      if (distance < minDistance && distance <= MAX_DISTANCE) {
        minDistance = distance;
        nearestSubstation = substation;
      }
    }
    
    if (nearestSubstation) {
      try {
        const { data, error } = await supabase
          .from('house_connections')
          .upsert({
            house_id: house.id,
            substation_id: nearestSubstation.id,
            distance_miles: minDistance
          })
          .select('*')
          .single();
        
        if (error) {
          console.error('Error creating connection:', error);
        } else if (data) {
          connections.push(data as HouseConnection);
        }
      } catch (error) {
        console.error('Error in upsert operation:', error);
      }
    }
  }
  
  return connections;
}
