
import { Badge } from '@/components/ui/badge';
import { Asset } from '../../types';
import { useRiskAssessment } from '../../hooks/useRiskAssessment';

interface RiskFactorsPanelProps {
  asset: Asset;
}

export const RiskFactorsPanel = ({ asset }: RiskFactorsPanelProps) => {
  const { getRiskColor, getRiskFactors } = useRiskAssessment(asset);
  const factors = getRiskFactors();

  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Risk Factors</h4>
      <div className="space-y-2">
        {factors.map((factor, index) => (
          <div key={index} className="flex items-center gap-2">
            <Badge variant="outline" className={getRiskColor(asset.risk_score)}>
              Risk
            </Badge>
            <span className="text-sm text-muted-foreground">{factor}</span>
          </div>
        ))}
        {factors.length === 0 && (
          <p className="text-sm text-muted-foreground">No specific risk factors identified</p>
        )}
      </div>
    </div>
  );
};
