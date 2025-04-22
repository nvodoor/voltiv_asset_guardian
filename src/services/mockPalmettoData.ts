
import { supabase } from "@/integrations/supabase/client";
import { PalmettoHouse } from "@/types/palmetto";

export async function createMockHouses(): Promise<PalmettoHouse[]> {
  const houses: PalmettoHouse[] = [];
  
  for (let i = 0; i < 30; i++) {
    const mockHouse = {
      palmetto_system_id: `SYS-${1000 + i}`,
      latitude: 37.75 + (Math.random() * 0.1 - 0.05),
      longitude: -122.43 + (Math.random() * 0.1 - 0.05),
      install_date: new Date(2020 + Math.floor(Math.random() * 3), 
                           Math.floor(Math.random() * 12), 
                           Math.floor(Math.random() * 28)).toISOString(),
      system_size_kw: 5 + Math.random() * 5,
      annual_production_kwh: 7000 + Math.floor(Math.random() * 3000),
      system_type: Math.random() > 0.5 ? 'Residential' : 'Commercial',
      city: 'San Francisco',
      state: 'CA'
    };
    
    const { data, error } = await supabase
      .from('palmetto_houses')
      .insert(mockHouse)
      .select('*')
      .single();
      
    if (error) {
      console.error('Error inserting mock house:', error);
    } else if (data) {
      houses.push(data as PalmettoHouse);
    }
  }
  
  return houses;
}
