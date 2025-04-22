
export interface PalmettoHouse {
  id: string;
  palmetto_system_id: string;
  latitude: number;
  longitude: number;
  install_date: string | null;
  system_size_kw: number | null;
  annual_production_kwh: number | null;
  system_type: string | null;
  city: string | null;
  state: string | null;
}

export interface Substation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  capacity_kw: number;
  current_load_kw: number | null;
}

export interface HouseConnection {
  id: string;
  house_id: string;
  substation_id: string;
  distance_miles: number;
}

export interface PalmettoData {
  houses: PalmettoHouse[];
  substations: Substation[];
  connections: HouseConnection[];
  getConnectedHouses: (substationId: string) => PalmettoHouse[];
}

export interface PGESubstation {
  objectid: number;
  substation_name: string;
  substation_id: number;
  number_of_banks: number;
  redacted_data: string;
  ungrounded_banks: string;
  division: string;
  existing_distributed_generation_kw: number;
  queued_distributed_generation_kw: number;
  total_distributed_generation_kw: number;
  last_update_on_map: string;
  minimum_voltage_kv: number;
  publish: number;
  x: number;
  y: number;
  // Added properties from transformation
  longitude: number;
  latitude: number;
}
