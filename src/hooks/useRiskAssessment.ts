import { Asset } from '../types';

const TRANSFORMER_RISK_MESSAGES = {
  critical: [
    "Transformer installed in 1970 (55 years old) is sustaining 95% of its rated capacity during afternoon peaks—risk of accelerated thermal fatigue and insulation wear.",
    "48-year-old transformer (installed 1977) has seen demand spikes up to 102% of nameplate capacity for the past 3 hours—urgent load relief required."
  ],
  high: [
    "Transformer installed in 1970 (55 years old) is sustaining 95% of its rated capacity during afternoon peaks—risk of accelerated thermal fatigue and insulation wear.",
    "48-year-old transformer (installed 1977) has seen demand spikes up to 102% of nameplate capacity for the past 3 hours—urgent load relief required."
  ],
  medium: [
    "Transformer from 1990 (35 years old) hit 88% loading during last evening peak—consider shifting some feeders or deploying demand response.",
    "28-year-old transformer (installed 1997) shows a daily load factor creeping above 0.9—monitor aging stress and plan maintenance."
  ],
  low: [
    "20-year-old transformer (installed 2005) is operating at 70% of capacity during peak hours—within normal limits but track trend.",
    "Transformer installed in 2003 (22 years old) experienced occasional load spikes to 75%—no immediate action needed."
  ]
};

export const useRiskAssessment = (asset: Asset) => {
  const getRiskColor = (score?: number) => {
    if (score === undefined) return "bg-gray-500";
    if (score >= 0.8) return "bg-risk-critical text-white";
    if (score >= 0.6) return "bg-risk-high text-white";
    if (score >= 0.3) return "bg-risk-medium";
    return "bg-risk-low";
  };

  const getTransformerRiskMessage = (score?: number) => {
    if (score === undefined) return "";
    const messages = score >= 0.8 ? TRANSFORMER_RISK_MESSAGES.critical :
                    score >= 0.6 ? TRANSFORMER_RISK_MESSAGES.high :
                    score >= 0.3 ? TRANSFORMER_RISK_MESSAGES.medium :
                                 TRANSFORMER_RISK_MESSAGES.low;
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getRiskFactors = () => {
    const factors: string[] = [];
    const ageFactor = (2023 - asset.install_year) / 50;

    if (asset.asset_type === 'transformer') {
      if (asset.risk_score !== undefined) {
        factors.push(getTransformerRiskMessage(asset.risk_score));
      }
    } else {
      if (ageFactor > 0.6) factors.push("Equipment age exceeds 30 years");
    
      switch (asset.asset_type) {
        case 'solarPanel':
          if (asset.metadata?.panel_count > 50) {
            factors.push("Large array size increases maintenance complexity");
          }
          if (asset.metadata?.shade_percentage > 20) {
            factors.push("Significant shading affects performance");
          }
          break;
        case 'windTurbine':
          if (asset.metadata?.height_meters > 80) {
            factors.push("Height-related maintenance challenges");
          }
          if (asset.metadata?.avg_wind_speed_mph < 10) {
            factors.push("Suboptimal wind conditions");
          }
          break;
        case 'battery':
          if (asset.metadata?.cycle_count > 1000) {
            factors.push("High cycle count impacts battery life");
          }
          if (asset.metadata?.temperature_celsius > 35) {
            factors.push("Elevated operating temperature");
          }
          break;
      }
    }
    return factors;
  };

  return {
    getRiskColor,
    getRiskFactors
  };
};
