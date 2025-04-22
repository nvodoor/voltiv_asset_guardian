import React from 'react';
import { AssetFilters, AssetType } from '../types';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FilterSidebarProps {
  filters: AssetFilters;
  onFiltersChange: (filters: AssetFilters) => void;
  onRefreshData: () => void;
  onRunRiskModel: () => void;
  assetCount: number;
  alertCount: number;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFiltersChange,
  onRefreshData,
  onRunRiskModel,
  assetCount,
  alertCount
}) => {
  const assetTypes: { value: AssetType; label: string }[] = [
    { value: 'house', label: 'Houses' },
    { value: 'substation', label: 'Substations' },
    { value: 'pole', label: 'Poles' },
    { value: 'transformer', label: 'Transformers' },
    { value: 'solarPanel', label: 'Solar Panels' },
    { value: 'windTurbine', label: 'Wind Turbines' },
    { value: 'battery', label: 'Batteries' }
  ];

  const handleAssetTypeChange = (type: AssetType, checked: boolean) => {
    let newTypes: AssetType[];
    
    if (checked) {
      newTypes = [...filters.assetTypes, type];
    } else {
      newTypes = filters.assetTypes.filter(t => t !== type);
    }
    
    onFiltersChange({
      ...filters,
      assetTypes: newTypes
    });
  };

  const handleRiskLevelChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      riskLevel: {
        min: value[0],
        max: value[1]
      }
    });
  };

  const handleYearRangeChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      yearRange: {
        min: value[0],
        max: value[1]
      }
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="text-lg flex justify-between items-center pb-2">            
        <span>Filters</span>
            <div className="flex space-x-2">
              <Badge variant="outline" className="rounded-full text-xs">
                Assets: {assetCount}
              </Badge>
              {alertCount > 0 && (
                <Badge variant="destructive" className="rounded-full text-xs">
                  Alerts: {alertCount}
                </Badge>
              )}
            </div>
      </div>
      <Card className="flex-1 border-0 shadow-none">
        <CardContent className="px-2">
          <Accordion type="multiple" defaultValue={["asset-types", "risk-level", "install-year"]} className="space-y-2">
            <AccordionItem value="asset-types" className="border border-gray-200 rounded-md">
              <AccordionTrigger className="px-4">Asset Types</AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4 space-y-2">
                {assetTypes.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`type-${type.value}`}
                      checked={filters.assetTypes.includes(type.value)}
                      onCheckedChange={(checked) => 
                        handleAssetTypeChange(type.value, checked as boolean)
                      }
                    />
                    <Label htmlFor={`type-${type.value}`} className="cursor-pointer">
                      {type.label}
                    </Label>
                  </div>
                ))}
                {filters.assetTypes.length > 0 && (
                  <Button 
                    variant="ghost" 
                    className="text-xs h-7 mt-2 w-full"
                    onClick={() => onFiltersChange({...filters, assetTypes: []})}
                  >
                    Clear Selection
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="risk-level" className="border border-gray-200 rounded-md">
              <AccordionTrigger className="px-4">Risk Level</AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4">
                <div className="space-y-4 pt-2">
                  <Slider 
                    defaultValue={[filters.riskLevel.min, filters.riskLevel.max]} 
                    max={1} 
                    min={0} 
                    step={0.1}
                    onValueChange={handleRiskLevelChange}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Min: {filters.riskLevel.min.toFixed(1)}</span>
                    <span>Max: {filters.riskLevel.max.toFixed(1)}</span>
                  </div>
                  <div className="flex flex-wrap justify-between">
                    <Badge variant="outline" className="bg-risk-low">
                      Low
                    </Badge>
                    <Badge variant="outline" className="bg-risk-medium">
                      Medium
                    </Badge>
                    <Badge variant="outline" className="bg-risk-high text-white">
                      High
                    </Badge>
                    <Badge variant="outline" className="bg-risk-critical text-white">
                      Critical
                    </Badge>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="install-year" className="border border-gray-200 rounded-md">
              <AccordionTrigger className="px-4">Installation Year</AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4">
                <div className="space-y-4 pt-2">
                  <Slider 
                    defaultValue={[filters.yearRange.min, filters.yearRange.max]} 
                    max={2023} 
                    min={1980} 
                    step={1}
                    onValueChange={handleYearRangeChange}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{filters.yearRange.min}</span>
                    <span>{filters.yearRange.max}</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default FilterSidebar;
