// Asset Types
export type AssetType = 'house' | 'substation' | 'pole' | 'transformer' | 'solarPanel' | 'windTurbine' | 'battery';

export interface Asset {
  id: string;
  asset_type: AssetType;
  latitude: number;
  longitude: number;
  install_year: number;
  metadata?: Record<string, any>;
  grid_capacity?: {
    capacity_percentage: number;
    constraint_level: 'low' | 'medium' | 'high' | 'critical';
  };
  parent_asset_id?: string;
  risk_score?: number;
}

export interface RiskAssessment {
  id: string;
  asset_id: string;
  risk_score: number;
  assessment_date: string;
  factors: string[];
}

export interface AlertNotification {
  id: string;
  asset_id: string;
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  acknowledged: boolean;
}

// Filter Types
export interface AssetFilters {
  assetTypes: AssetType[];
  riskLevel: {
    min: number;
    max: number;
  };
  yearRange: {
    min: number;
    max: number;
  };
}

// Grid Capacity Interface
export interface GridCapacity {
  feeder_id?: string;
  substation_id?: string;
  capacity_percentage: number;
  constraint_level: 'low' | 'medium' | 'high' | 'critical';
}
