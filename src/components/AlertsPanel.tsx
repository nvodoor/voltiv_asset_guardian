
import React from 'react';
import { AlertNotification, Asset } from '../types';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';

interface AlertsPanelProps {
  alerts: AlertNotification[];
  assets: Asset[];
  onAlertAcknowledge: (alertId: string) => void;
  onAssetSelect: (asset: Asset) => void;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ 
  alerts, 
  assets, 
  onAlertAcknowledge,
  onAssetSelect
}) => {
  const activeAlerts = alerts.filter(alert => !alert.acknowledged);
  
  const getSeverityClass = (severity: AlertNotification['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-risk-critical text-white';
      case 'high': return 'bg-risk-high text-white';
      case 'medium': return 'bg-risk-medium';
      case 'low': return 'bg-risk-low';
      default: return 'bg-gray-500 text-white';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const getAssetForAlert = (alertAssetId: string) => {
    return assets.find(asset => asset.id === alertAssetId);
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative">
          <Bell className="h-4 w-4 mr-2" />
          Alerts
          {activeAlerts.length > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 min-w-5 p-0 flex items-center justify-center bg-risk-high text-white rounded-full text-xs">
              {activeAlerts.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Asset Alerts
            {activeAlerts.length > 0 && (
              <Badge className="ml-2 bg-risk-high text-white">
                {activeAlerts.length} Active
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Alerts for high-risk infrastructure assets
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[400px] pr-4">
          {activeAlerts.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No active alerts
            </div>
          ) : (
            <div className="space-y-4">
              {activeAlerts.map((alert) => {
                const asset = getAssetForAlert(alert.asset_id);
                
                return (
                  <div key={alert.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={getSeverityClass(alert.severity)}>
                        {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(alert.timestamp)}
                      </span>
                    </div>
                    
                    <h4 className="font-medium mb-1">
                      {asset?.asset_type.charAt(0).toUpperCase() + asset?.asset_type.slice(1)} Alert
                    </h4>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {alert.message}
                    </p>
                    
                    <div className="flex justify-between">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          if (asset) {
                            onAssetSelect(asset);
                          }
                        }}
                        disabled={!asset}
                      >
                        View Asset
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onAlertAcknowledge(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {alerts.length > activeAlerts.length && (
            <>
              <Separator className="my-4" />
              <h3 className="font-medium text-sm mb-2 text-muted-foreground">Acknowledged Alerts</h3>
              <div className="space-y-2 opacity-60">
                {alerts
                  .filter(alert => alert.acknowledged)
                  .slice(0, 3)
                  .map((alert) => (
                    <div key={alert.id} className="text-sm border rounded-lg p-2">
                      <div className="flex justify-between">
                        <Badge className={`${getSeverityClass(alert.severity)} text-xs`}>
                          {alert.severity}
                        </Badge>
                        <span className="text-xs">{formatDate(alert.timestamp)}</span>
                      </div>
                      <p className="text-xs mt-1 truncate">{alert.message}</p>
                    </div>
                  ))}
                
                {alerts.filter(alert => alert.acknowledged).length > 3 && (
                  <p className="text-xs text-center text-muted-foreground pt-1">
                    +{alerts.filter(alert => alert.acknowledged).length - 3} more acknowledged alerts
                  </p>
                )}
              </div>
            </>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AlertsPanel;
