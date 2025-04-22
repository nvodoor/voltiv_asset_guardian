
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PalmettoData, PalmettoHouse, Substation, HouseConnection } from "@/types/palmetto";
import { assignHousesToSubstations } from "@/services/palmettoConnections";
import { createMockHouses } from "@/services/mockPalmettoData";

export const usePalmettoHouses = () => {
  return useQuery({
    queryKey: ['palmetto-houses'],
    queryFn: async () => {
      try {
        // Mock data for development if the API isn't available
        const useRealData = true;
        let houses: PalmettoHouse[] = [];
        
        if (useRealData) {
          // Fetch houses from Supabase
          const { data: housesData, error: housesError } = await supabase
            .from('palmetto_houses')
            .select('*');
  
          if (housesError) throw housesError;
          
          houses = housesData as PalmettoHouse[] || [];
          
          // If we have no houses data, let's create some mock data
          if (houses.length === 0) {
            houses = await createMockHouses();
          }
        }
  
        // Fetch substations
        const { data: substations, error: substationsError } = await supabase
          .from('substations')
          .select('*');
  
        if (substationsError) throw substationsError;
  
        // Create house-substation connections if we have both houses and substations
        let connections: HouseConnection[] = [];
        if (houses.length > 0 && substations.length > 0) {
          // First check if we already have connections
          const { data: existingConnections, error: connectionsError } = await supabase
            .from('house_connections')
            .select('*');
  
          if (connectionsError) throw connectionsError;
          
          if (existingConnections && existingConnections.length > 0) {
            connections = existingConnections as HouseConnection[];
          } else {
            // Create new connections for houses to nearest substations
            connections = await assignHousesToSubstations(houses, substations as Substation[]);
          }
        }
  
        // Create the complete data structure
        const palmettoData: PalmettoData = {
          houses,
          substations: substations as Substation[] || [],
          connections,
          getConnectedHouses: (substationId: string) => {
            const connectedHouseIds = connections
              .filter(conn => conn.substation_id === substationId)
              .map(conn => conn.house_id);
            
            return houses.filter(house => 
              connectedHouseIds.includes(house.id)
            );
          }
        };
  
        return palmettoData;
      } catch (error) {
        console.error('Error fetching Palmetto data:', error);
        return {
          houses: [] as PalmettoHouse[],
          substations: [] as Substation[],
          connections: [] as HouseConnection[],
          getConnectedHouses: () => []
        };
      }
    }
  });
};
