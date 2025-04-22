import React, { useState } from 'react';
import { Asset, AlertNotification } from '../types';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AlertsPanel from './AlertsPanel';
import { Settings, Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";


interface DashboardHeaderProps {
  title: string;
  alerts: AlertNotification[];
  assets: Asset[];
  onRunRiskModel: () => void;
  onRefreshData: () => void;
  onAlertAcknowledge: (alertId: string) => void;
  onAssetSelect: (asset: Asset) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  alerts,
  assets,
  onRunRiskModel,
  onRefreshData,
  onAlertAcknowledge,
  onAssetSelect
}) => {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  const syncPalmettoData = async () => {
    if (isSyncing) return; // Prevent multiple clicks
    
    try {
      setIsSyncing(true);
      toast({
        title: "Syncing Data",
        description: "Connecting to Palmetto Energy API...",
      });

      const { data, error } = await supabase.functions.invoke('palmetto-sync', {
        method: 'POST',
      });
      
      if (error) {
        console.error("Palmetto sync error:", error);
        
        // Extract more specific error message
        let errorMessage = "Failed to sync with Palmetto Energy API";
        if (error.message) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
        
        toast({
          title: "Sync Failed",
          description: errorMessage,
          variant: "destructive"
        });
        return;
      }
      
      // Handle specific error messages from the edge function
      if (data?.error) {
        console.error("Palmetto API error:", data.error, data.details);
        
        let errorMessage = data.error;
        if (data.details) {
          errorMessage += `: ${data.details}`;
        }
        
        toast({
          title: "Sync Failed",
          description: errorMessage,
          variant: "destructive"
        });
        return;
      }

      // Show validation errors if any
      if (data?.validationErrors?.length > 0) {
        console.warn("Validation errors:", data.validationErrors);
        toast({
          title: "Sync Completed with Warnings",
          description: `${data.message}. ${data.validationErrors.length} validation issues found.`,
          variant: "default"
        });
      } else {
        toast({
          title: "Sync Successful",
          description: data?.message || "Successfully synced with Palmetto Energy API"
        });
      }
      
      // Refresh the map data
      onRefreshData();
      
    } catch (error) {
      console.error("Palmetto sync exception:", error);
      toast({
        title: "Sync Failed",
        description: error instanceof Error ? error.message : "Failed to connect to Palmetto Energy API service",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };


  return (
    <header className="bg-white border-b shadow-sm py-3 px-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">Predictive Maintenance Platform</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <AlertsPanel 
            alerts={alerts} 
            assets={assets}
            onAlertAcknowledge={onAlertAcknowledge}
            onAssetSelect={onAssetSelect}
          />
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Settings</SheetTitle>
              </SheetHeader>
              
              <div className="py-4">
                <h3 className="text-sm font-medium mb-2">Data Management</h3>
                <div className="space-y-2">
                  <Button 
                    onClick={onRefreshData}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    Refresh Asset Data
                  </Button>
                  <Button 
                    onClick={onRunRiskModel}
                    className="w-full justify-start" 
                    variant="outline"
                  >
                    Run Risk Assessment Model
                  </Button>
                  <Button 
                    onClick={syncPalmettoData}
                    className="w-full justify-start" 
                    variant="outline"
                    disabled={isSyncing}
                  >
                    {isSyncing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Syncing Palmetto Houses...
                      </>
                    ) : (
                      'Sync Palmetto Houses'
                    )}
                  </Button>
                </div>
                
                <Separator className="my-4" />
                
                <h3 className="text-sm font-medium mb-2">Notification Settings</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs">Email Alerts</label>
                    <input type="checkbox" defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs">SMS Alerts</label>
                    <input type="checkbox" defaultChecked={false} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs">Alert Threshold</label>
                    <select className="text-xs border rounded px-1">
                      <option>Very High (0.9+)</option>
                      <option selected>High (0.8+)</option>
                      <option>Medium (0.6+)</option>
                      <option>Low (0.4+)</option>
                    </select>
                  </div>
                </div>
                                
                <Separator className="my-4" />
                
                <div className="text-xs text-gray-500 mt-4">
                  <strong>Voltiv Asset Guardian</strong><br />
                  Version 1.0.0
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
