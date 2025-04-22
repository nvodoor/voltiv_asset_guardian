
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Asset } from '../../types';
import { fetchGridCapacityData } from '../../services/textureApi';
import { useRiskAssessment } from '../../hooks/useRiskAssessment';

interface GridCapacityStatusProps {
  asset: Asset;
}

export const GridCapacityStatus = ({ asset }: GridCapacityStatusProps) => {
  const [isLoadingCapacity, setIsLoadingCapacity] = useState(false);
  const [gridCapacityData, setGridCapacityData] = useState<any>(null);
  const { getRiskColor } = useRiskAssessment(asset);

  useEffect(() => {
    setIsLoadingCapacity(true);
    fetchGridCapacityData(asset.id)
      .then(data => {
        setGridCapacityData(data);
        setIsLoadingCapacity(false);
      })
      .catch(err => {
        console.error("Error fetching grid capacity:", err);
        setIsLoadingCapacity(false);
      });
  }, [asset.id]);

  const getConstraintColor = (level?: string) => {
    if (!level) return "bg-gray-500";
    switch (level) {
      case 'critical': return "bg-risk-critical text-white";
      case 'high': return "bg-risk-high text-white";
      case 'medium': return "bg-risk-medium";
      case 'low': return "bg-risk-low";
      default: return "bg-gray-500";
    }
  };

  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Grid Capacity Status</h4>
      {isLoadingCapacity ? (
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          <span className="text-sm">Loading capacity data...</span>
        </div>
      ) : gridCapacityData ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Capacity:</span>
            <Badge className={getConstraintColor(gridCapacityData.constraint_level)}>
              {gridCapacityData.capacity_percentage}% ({gridCapacityData.constraint_level})
            </Badge>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                gridCapacityData.capacity_percentage >= 90 ? 'bg-risk-critical' :
                gridCapacityData.capacity_percentage >= 75 ? 'bg-risk-high' :
                gridCapacityData.capacity_percentage >= 50 ? 'bg-risk-medium' :
                'bg-risk-low'
              }`}
              style={{ width: `${gridCapacityData.capacity_percentage}%` }}
            ></div>
          </div>
          
          {gridCapacityData.predicted_failure_risk !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Failure Risk:</span>
              <Badge className={getRiskColor(gridCapacityData.predicted_failure_risk)}>
                {(gridCapacityData.predicted_failure_risk * 100).toFixed(0)}%
              </Badge>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No grid capacity data available from Texture API.
        </p>
      )}
    </div>
  );
};

