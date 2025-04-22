
import React from 'react';
import { Asset, RiskAssessment } from '../types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RiskFactorsPanel } from './asset/RiskFactorsPanel';
import { useRiskAssessment } from '../hooks/useRiskAssessment';

interface AssetDetailsProps {
  asset: Asset;
  riskAssessment?: RiskAssessment;
  onClose: () => void;
  onRunRiskAssessment: (assetId: string) => void;
  onSendAlert: (assetId: string) => void;
}

const AssetDetails: React.FC<AssetDetailsProps> = ({ 
  asset, 
  riskAssessment, 
  onClose, 
  onRunRiskAssessment,
  onSendAlert
}) => {
  const { getRiskColor } = useRiskAssessment(asset);
  
  const formatAssetType = (type: string) => {
    return type
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  const formatMetadataKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  const showAlertButton = asset.risk_score !== undefined && asset.risk_score >= 0.7;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{formatAssetType(asset.asset_type)} {asset.id}</CardTitle>
            <CardDescription>Installed: {asset.install_year}</CardDescription>
          </div>
          <Badge className={getRiskColor(asset.risk_score)}>
            {asset.risk_score !== undefined ? `Risk: ${asset.risk_score.toFixed(2)}` : 'No Risk Assessment'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Location</h4>
          <p className="text-sm text-muted-foreground">
            Lat: {asset.latitude.toFixed(6)}, Lng: {asset.longitude.toFixed(6)}
          </p>
        </div>
        
        <Separator />
        
        <RiskFactorsPanel asset={asset} />
        
        <Separator />
        
        <div>
          <h4 className="text-sm font-medium mb-2">Specifications</h4>
          <div className="grid grid-cols-2 gap-2">
            {asset.metadata && Object.entries(asset.metadata).map(([key, value]) => (
              <div key={key} className="text-sm">
                <span className="font-medium">{formatMetadataKey(key)}:</span>{' '}
                <span className="text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" onClick={onClose}>Close</Button>
        <div className="space-x-2">
          {showAlertButton && (
            <Button 
              variant="destructive" 
              onClick={() => onSendAlert(asset.id)}
            >
              Send Alert
            </Button>
          )}
          <Button 
            variant="default" 
            onClick={() => onRunRiskAssessment(asset.id)}
          >
            Run Risk Assessment
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AssetDetails;
