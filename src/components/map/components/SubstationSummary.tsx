
import React from 'react';
import { Substation, PalmettoHouse } from '@/types/palmetto';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SubstationSummaryProps {
  substation: Substation;
  connectedHouses: PalmettoHouse[];
  onClose: () => void;
}

const SubstationSummary: React.FC<SubstationSummaryProps> = ({ 
  substation, 
  connectedHouses,
  onClose
}) => {
  // Calculate total production
  const totalProduction = connectedHouses.reduce(
    (sum, house) => sum + (house.annual_production_kwh || 0), 
    0
  );
  
  // Calculate average system size
  const averageSystemSize = connectedHouses.length > 0 
    ? connectedHouses.reduce((sum, house) => sum + (house.system_size_kw || 0), 0) / connectedHouses.length
    : 0;
  
  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="bg-primary/10 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">
            {substation.name} Summary
          </CardTitle>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Connected Houses</p>
            <p className="text-2xl font-semibold">{connectedHouses.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Production</p>
            <p className="text-2xl font-semibold">
              {totalProduction.toLocaleString()} kWh
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Available Capacity</p>
            <p className="text-2xl font-semibold">
              {substation.capacity_kw.toLocaleString()} kW
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg System Size</p>
            <p className="text-2xl font-semibold">
              {averageSystemSize.toFixed(1)} kW
            </p>
          </div>
        </div>
        
        {connectedHouses.length > 0 ? (
          <>
            <h4 className="font-medium mb-2">Connected Houses</h4>
            <ScrollArea className="h-40 rounded border p-2">
              {connectedHouses.map(house => (
                <div key={house.id} className="py-2 border-b last:border-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{house.palmetto_system_id}</span>
                    <span className="text-sm">{house.system_size_kw?.toFixed(1)} kW</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {house.annual_production_kwh?.toLocaleString()} kWh/year
                  </div>
                </div>
              ))}
            </ScrollArea>
          </>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No houses are currently connected to this substation.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubstationSummary;
