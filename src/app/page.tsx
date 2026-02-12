'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import GlobalFilters, { FilterState } from '@/components/layout/GlobalFilters';
import FootfallIntelligence from '@/components/dashboard/FootfallIntelligence';
import ZonePerformance from '@/components/dashboard/ZonePerformance';
import FlowVisualization from '@/components/dashboard/FlowVisualization';
import SafetyAlerts from '@/components/dashboard/SafetyAlerts';
import HeatmapOverlay from '@/components/visualization/HeatmapOverlay';

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      end: new Date(),
    },
    building: 'Building A',
    floor: 'Ground Floor',
    granularity: '1h',
  });

  return (
    <DashboardLayout>
      <GlobalFilters onFilterChange={setFilters} />

      {/* Top Row: Alerts */}
      <div className="mb-6">
        <SafetyAlerts />
      </div>

      {/* Second Row: Footfall Intelligence */}
      <div className="mb-6">
        <FootfallIntelligence
          granularity={filters.granularity}
          dateRange={filters.dateRange}
        />
      </div>

      {/* Third Row: Zone Performance and Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ZonePerformance />
        <HeatmapOverlay />
      </div>

      {/* Fourth Row: Flow Visualization */}
      <div className="mb-6">
        <FlowVisualization />
      </div>
    </DashboardLayout>
  );
}
