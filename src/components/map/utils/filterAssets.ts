
import { Asset, AssetFilters } from '../../../types';

export const filterAssets = (assets: Asset[], filters: AssetFilters) => {
  return assets.filter(asset => {
    const matchesType = filters.assetTypes.length === 0 || filters.assetTypes.includes(asset.asset_type);
    const hasValidCoordinates = typeof asset.longitude === 'number' && !isNaN(asset.longitude) &&
                               typeof asset.latitude === 'number' && !isNaN(asset.latitude) &&
                               asset.longitude >= -180 && asset.longitude <= 180 &&
                               asset.latitude >= -90 && asset.latitude <= 90;
    const matchesRisk = (asset.risk_score !== undefined) &&
                       (asset.risk_score >= filters.riskLevel.min) &&
                       (asset.risk_score <= filters.riskLevel.max);
    const matchesYear = (asset.install_year >= filters.yearRange.min) &&
                       (asset.install_year <= filters.yearRange.max);
    return matchesType && hasValidCoordinates && matchesRisk && matchesYear;
  });
};
