
import React, { useState, useEffect } from 'react';
import Map from '../components/map';
import FilterSidebar from '../components/FilterSidebar';
import AssetDetails from '../components/AssetDetails';
import DashboardHeader from '../components/DashboardHeader';
import { Asset, AssetFilters, RiskAssessment, AlertNotification } from '../types';
import { useToast } from '@/hooks/use-toast';
import { createMockGridAssets } from '@/services/mockGridAssets';

const Index = () => {
  const { toast } = useToast();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedRiskAssessment, setSelectedRiskAssessment] = useState<RiskAssessment | null>(null);
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);
  const [mockAssets, setMockAssets] = useState<Asset[]>([]);
  
  useEffect(() => {
    // Initialize mock assets
    setMockAssets(createMockGridAssets());
  }, []);
  
  // Initialize filters
  const [filters, setFilters] = useState<AssetFilters>({
    assetTypes: [],
    riskLevel: { min: 0, max: 1 },
    yearRange: { min: 1980, max: 2023 }
  });

  // Handle filter changes
  const handleFiltersChange = (newFilters: AssetFilters) => {
    setFilters(newFilters);
  };

  // Handle asset selection
  const handleAssetSelect = (asset: Asset) => {
    setSelectedAsset(asset);
    // Since we're not using mock risk assessments anymore, this will be null
    setSelectedRiskAssessment(null);
  };

  // Handle alert acknowledgement
  const handleAlertAcknowledge = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
    
    toast({
      title: "Alert Acknowledged",
      description: "The alert has been marked as acknowledged",
    });
  };

  return (
    <div className="flex flex-col h-screen w-full">
      <DashboardHeader 
        title="Voltiv Asset Guardian" 
        alerts={alerts}
        assets={mockAssets}
        onRunRiskModel={() => {}} 
        onRefreshData={() => {}} 
        onAlertAcknowledge={handleAlertAcknowledge}
        onAssetSelect={handleAssetSelect}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 border-r p-4 overflow-auto">
          <FilterSidebar 
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onRefreshData={() => {}} 
            onRunRiskModel={() => {}} 
            assetCount={mockAssets.length}
            alertCount={alerts.filter(a => !a.acknowledged).length}
          />
        </div>
        
        <div className="flex-1 flex flex-col p-4">
          <div className="flex-1 rounded-lg overflow-hidden border">
            <Map 
              assets={mockAssets}
              filters={filters}
              onAssetSelect={handleAssetSelect}
            />
          </div>
          
          {selectedAsset && (
            <div className="mt-4">
              <AssetDetails 
                asset={selectedAsset}
                onClose={() => {
                  setSelectedAsset(null);
                  setSelectedRiskAssessment(null);
                }}
                onRunRiskAssessment={() => {}}
                onSendAlert={() => {}}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
