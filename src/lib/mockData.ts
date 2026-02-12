// Mock data generator for footfall analytics

export interface FootfallDataPoint {
  timestamp: string;
  inflow: number;
  outflow: number;
}

export function generateFootfallData(
  startDate: Date,
  endDate: Date,
  granularity: '15m' | '1h' | '1d' = '1h'
): FootfallDataPoint[] {
  const data: FootfallDataPoint[] = [];
  const current = new Date(startDate);
  
  const incrementMs = granularity === '15m' 
    ? 15 * 60 * 1000 
    : granularity === '1h' 
    ? 60 * 60 * 1000 
    : 24 * 60 * 60 * 1000;

  while (current <= endDate) {
    const hour = current.getHours();
    const isPeakHour = hour >= 10 && hour <= 20;
    
    data.push({
      timestamp: current.toISOString(),
      inflow: Math.floor(Math.random() * (isPeakHour ? 150 : 50)) + (isPeakHour ? 50 : 10),
      outflow: Math.floor(Math.random() * (isPeakHour ? 140 : 45)) + (isPeakHour ? 45 : 10),
    });
    
    current.setTime(current.getTime() + incrementMs);
  }
  
  return data;
}

export interface Zone {
  id: string;
  name: string;
  polygon: [number, number][];
  currentDensity: number;
  avgDwellTime: number;
  totalFootfall: number;
  area: number;
}

export function generateZones(): Zone[] {
  return [
    {
      id: 'zone-1',
      name: 'Main Entrance',
      polygon: [[10, 10], [100, 10], [100, 80], [10, 80]],
      currentDensity: 0.8,
      avgDwellTime: 45,
      totalFootfall: 1250,
      area: 90,
    },
    {
      id: 'zone-2',
      name: 'Food Court',
      polygon: [[120, 10], [250, 10], [250, 120], [120, 120]],
      currentDensity: 1.2,
      avgDwellTime: 1800,
      totalFootfall: 890,
      area: 130,
    },
    {
      id: 'zone-3',
      name: 'Retail Area A',
      polygon: [[10, 100], [100, 100], [100, 200], [10, 200]],
      currentDensity: 0.5,
      avgDwellTime: 600,
      totalFootfall: 650,
      area: 90,
    },
    {
      id: 'zone-4',
      name: 'Event Space',
      polygon: [[120, 140], [300, 140], [300, 250], [120, 250]],
      currentDensity: 2.1,
      avgDwellTime: 2400,
      totalFootfall: 1500,
      area: 180,
    },
    {
      id: 'zone-5',
      name: 'Restrooms',
      polygon: [[310, 10], [380, 10], [380, 60], [310, 60]],
      currentDensity: 0.3,
      avgDwellTime: 180,
      totalFootfall: 420,
      area: 50,
    },
  ];
}

export interface FlowData {
  source: string;
  target: string;
  count: number;
}

export function generateFlowData(): FlowData[] {
  return [
    { source: 'zone-1', target: 'zone-2', count: 450 },
    { source: 'zone-1', target: 'zone-3', count: 320 },
    { source: 'zone-2', target: 'zone-4', count: 280 },
    { source: 'zone-3', target: 'zone-2', count: 190 },
    { source: 'zone-4', target: 'zone-2', count: 210 },
    { source: 'zone-1', target: 'zone-5', count: 150 },
    { source: 'zone-5', target: 'zone-2', count: 120 },
  ];
}

export interface Alert {
  id: string;
  type: 'congestion' | 'queue';
  zoneId: string;
  zoneName: string;
  timestamp: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export function generateAlerts(): Alert[] {
  const zones = generateZones();
  const alerts: Alert[] = [];
  
  zones.forEach(zone => {
    if (zone.currentDensity > 1.5) {
      alerts.push({
        id: `alert-${zone.id}`,
        type: 'congestion',
        zoneId: zone.id,
        zoneName: zone.name,
        timestamp: new Date().toISOString(),
        message: `High density detected in ${zone.name}: ${zone.currentDensity.toFixed(1)} persons/m²`,
        severity: zone.currentDensity > 2 ? 'high' : 'medium',
      });
    }
  });
  
  return alerts;
}
