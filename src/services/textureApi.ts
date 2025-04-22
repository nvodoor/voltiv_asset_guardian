import { Asset } from '../types';

// Texture API access key - in a production app, this should be stored in env variables
const TEXTURE_API_KEY = process.env.TEXTURE_API_KEY;
const TEXTURE_API_BASE_URL = "https://api.texture.energy";

export interface GridCapacityData {
  feeder_id: string;
  substation_id: string;
  capacity_percentage: number;
  constraint_level: 'low' | 'medium' | 'high' | 'critical';
  predicted_failure_risk: number;
  constraint_factors: string[];
}

export interface InterconnectionQueueData {
  queue_position: number;
  project_type: string;
  capacity_mw: number;
  estimated_completion: string;
}

export interface GridConstraintData {
  id: string;
  type: 'feeder' | 'substation' | 'transmission';
  capacity_percentage: number;
  constraint_level: 'low' | 'medium' | 'high' | 'critical';
  predicted_failure_risk: number;
  constraint_factors: string[];
}

// Fetch grid capacity data for a specific asset
export const fetchGridCapacityData = async (assetId: string): Promise<GridCapacityData | null> => {
  try {
    const response = await fetch(`${TEXTURE_API_BASE_URL}/v1/grid-capacity/${assetId}`, {
      headers: {
        'Authorization': `Bearer ${TEXTURE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`Error fetching grid capacity data: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch grid capacity data:", error);
    return null;
  }
};

// Fetch interconnection queue data for a specific region
export const fetchInterconnectionQueueData = async (regionId: string): Promise<InterconnectionQueueData[] | null> => {
  try {
    const response = await fetch(`${TEXTURE_API_BASE_URL}/v1/interconnection-queue/${regionId}`, {
      headers: {
        'Authorization': `Bearer ${TEXTURE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`Error fetching interconnection queue data: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch interconnection queue data:", error);
    return null;
  }
};

// Generate mock constraint data for all assets in a region
export const fetchGridConstraintData = async (assets: Asset[]): Promise<Map<string, GridConstraintData>> => {
  const constraintMap = new Map<string, GridConstraintData>();
  
  assets.forEach(asset => {
    // Changed from comparing asset_type to checking if it matches either 'substation' or 'transformer'
    if (asset.asset_type === 'substation' || asset.asset_type === 'transformer') {
      // Use asset risk score to generate constraint level
      const capacityPercentage = asset.risk_score 
        ? Math.min(100, Math.round((asset.risk_score * 100) + Math.random() * 20))
        : Math.round(40 + Math.random() * 60);
      
      let constraintLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (capacityPercentage >= 90) constraintLevel = 'critical';
      else if (capacityPercentage >= 75) constraintLevel = 'high';
      else if (capacityPercentage >= 50) constraintLevel = 'medium';
      
      // Generate predicted failure risk based on capacity and asset age
      const ageFactor = (2023 - asset.install_year) / 50; // Normalize age to 0-1 range assuming 50 year lifespan
      const predictedFailureRisk = Math.min(0.95, (capacityPercentage / 100) * 0.7 + ageFactor * 0.3);
      
      // Generate constraint factors based on asset type and conditions
      const constraintFactors: string[] = [];
      
      if (capacityPercentage > 80) constraintFactors.push("High load utilization");
      if (ageFactor > 0.6) constraintFactors.push("Equipment age");
      if (asset.risk_score && asset.risk_score > 0.5) constraintFactors.push("Maintenance history");
      
      // Check for specific asset type metadata and add corresponding constraint factors
      if (asset.asset_type === 'transformer') {
        if (asset.metadata?.oil_temp_celsius > 55) {
          constraintFactors.push("High oil temperature");
        }
        if (asset.metadata?.type === 'pole-mounted') {
          constraintFactors.push("Exposed to weather conditions");
        }
      }
      
      // Add general constraint factors for critical/high constraint levels
      if (constraintLevel === 'critical' || constraintLevel === 'high') {
        constraintFactors.push("Predicted load growth");
      }
      
      constraintMap.set(asset.id, {
        id: asset.id,
        type: asset.asset_type === 'substation' ? 'substation' : 'feeder',
        capacity_percentage: capacityPercentage,
        constraint_level: constraintLevel,
        predicted_failure_risk: predictedFailureRisk,
        constraint_factors: constraintFactors
      });
    }
  });
  
  return constraintMap;
};

// Calculate the risk of failure based on constraint data and other factors
export const calculateFailureRisk = (
  asset: Asset, 
  constraintData?: GridConstraintData
): { riskScore: number; factors: string[] } => {
  const baseRiskScore = asset.risk_score || 0.2;
  const factors: string[] = [];
  
  // If we have constraint data, incorporate it
  if (constraintData) {
    // Return the predicted risk from Texture API directly
    return {
      riskScore: constraintData.predicted_failure_risk,
      factors: constraintData.constraint_factors
    };
  }
  
  // If no constraint data, calculate based on age and type
  const ageFactor = (2023 - asset.install_year) / 40; // Normalize age to 0-1 range
  let riskScore = baseRiskScore * 0.6 + ageFactor * 0.4;
  
  // Add factors based on calculated risk
  if (ageFactor > 0.7) factors.push("Equipment approaching end of service life");
  if (baseRiskScore > 0.6) factors.push("Previous maintenance issues detected");
  if (riskScore > 0.7) factors.push("High-stress geographic location");
  
  // Add asset-specific risk factors based on metadata
  if (asset.asset_type === 'pole' && asset.metadata?.material === 'wood') {
    factors.push("Material degradation risk");
    riskScore += 0.1;
  }
  
  if (asset.asset_type === 'transformer' && asset.metadata?.oil_temp_celsius > 55) {
    factors.push("High oil temperature");
    riskScore += 0.15;
  }
  
  if (asset.asset_type === 'solarPanel' && asset.metadata?.panel_count > 50) {
    factors.push("Large array maintenance complexity");
    riskScore += 0.05;
  }
  
  if (asset.asset_type === 'windTurbine' && asset.metadata?.height_meters > 80) {
    factors.push("Height-related maintenance challenges");
    riskScore += 0.08;
  }
  
  if (asset.asset_type === 'battery' && asset.metadata?.chemistry === 'lithium-ion') {
    factors.push("Thermal management requirements");
    riskScore += 0.07;
  }
  
  return {
    riskScore: Math.min(0.95, riskScore),
    factors
  };
};
