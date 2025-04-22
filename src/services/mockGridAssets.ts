
import { Asset } from '../types';

const generateMetadata = (assetType: string) => {
  switch (assetType) {
    case 'pole':
      return {
        height_ft: 30 + Math.floor(Math.random() * 20),
        material: Math.random() > 0.5 ? 'wood' : 'concrete',
        last_inspection: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
    case 'transformer':
      return {
        capacity_kva: 100 * Math.floor(1 + Math.random() * 5),
        type: Math.random() > 0.5 ? 'pad-mounted' : 'pole-mounted',
        oil_temp_celsius: 35 + Math.floor(Math.random() * 30)
      };
    case 'solarPanel':
      return {
        panel_count: 10 + Math.floor(Math.random() * 90),
        panel_type: Math.random() > 0.5 ? 'monocrystalline' : 'polycrystalline',
        peak_capacity_kw: 5 + Math.floor(Math.random() * 15)
      };
    case 'windTurbine':
      return {
        height_meters: 40 + Math.floor(Math.random() * 60),
        blade_diameter_meters: 20 + Math.floor(Math.random() * 40),
        rated_power_kw: 100 * Math.floor(1 + Math.random() * 10)
      };
    case 'battery':
      return {
        capacity_kwh: 50 * Math.floor(1 + Math.random() * 4),
        chemistry: Math.random() > 0.5 ? 'lithium-ion' : 'flow',
        max_charge_rate_kw: 10 + Math.floor(Math.random() * 20)
      };
    default:
      return {};
  }
};

const generateGridCapacity = () => {
  const capacityPercentage = Math.floor(Math.random() * 100);
  // Use type assertion to ensure the constraint_level is one of the allowed literal types
  const constraint_level: 'low' | 'medium' | 'high' | 'critical' = 
    capacityPercentage >= 90 ? 'critical' :
    capacityPercentage >= 75 ? 'high' :
    capacityPercentage >= 50 ? 'medium' : 'low';
  
  return {
    capacity_percentage: capacityPercentage,
    constraint_level
  };
};

export const createMockGridAssets = (): Asset[] => {
  const assets: Asset[] = [];
  
  // Create mock poles (20)
  for (let i = 0; i < 20; i++) {
    assets.push({
      id: `pole-${i}`,
      asset_type: 'pole',
      latitude: 37.75 + (Math.random() * 0.1 - 0.05),
      longitude: -122.43 + (Math.random() * 0.1 - 0.05),
      install_year: 2000 + Math.floor(Math.random() * 23),
      risk_score: Math.random(),
      metadata: generateMetadata('pole')
    });
  }

  // Create mock transformers (15)
  for (let i = 0; i < 15; i++) {
    assets.push({
      id: `transformer-${i}`,
      asset_type: 'transformer',
      latitude: 37.75 + (Math.random() * 0.1 - 0.05),
      longitude: -122.43 + (Math.random() * 0.1 - 0.05),
      install_year: 2000 + Math.floor(Math.random() * 23),
      risk_score: Math.random(),
      grid_capacity: generateGridCapacity(),
      metadata: generateMetadata('transformer')
    });
  }

  // Create mock solar panels (10)
  for (let i = 0; i < 10; i++) {
    assets.push({
      id: `solar-${i}`,
      asset_type: 'solarPanel',
      latitude: 37.75 + (Math.random() * 0.1 - 0.05),
      longitude: -122.43 + (Math.random() * 0.1 - 0.05),
      install_year: 2015 + Math.floor(Math.random() * 8),
      risk_score: Math.random() * 0.5, // Solar panels tend to have lower risk
      metadata: generateMetadata('solarPanel')
    });
  }

  // Create mock wind turbines (5)
  for (let i = 0; i < 5; i++) {
    assets.push({
      id: `wind-${i}`,
      asset_type: 'windTurbine',
      latitude: 37.75 + (Math.random() * 0.1 - 0.05),
      longitude: -122.43 + (Math.random() * 0.1 - 0.05),
      install_year: 2010 + Math.floor(Math.random() * 13),
      risk_score: Math.random(),
      metadata: generateMetadata('windTurbine')
    });
  }

  // Create mock batteries (8)
  for (let i = 0; i < 8; i++) {
    assets.push({
      id: `battery-${i}`,
      asset_type: 'battery',
      latitude: 37.75 + (Math.random() * 0.1 - 0.05),
      longitude: -122.43 + (Math.random() * 0.1 - 0.05),
      install_year: 2018 + Math.floor(Math.random() * 5),
      risk_score: Math.random() * 0.4, // Batteries tend to have lower risk
      metadata: generateMetadata('battery')
    });
  }

  return assets;
};
