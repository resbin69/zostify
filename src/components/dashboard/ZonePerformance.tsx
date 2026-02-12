'use client';

import { useEffect, useState } from 'react';
import { fetchZones } from '@/lib/api';
import { Zone } from '@/lib/mockData';

export default function ZonePerformance() {
    const [zones, setZones] = useState<Zone[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<'totalFootfall' | 'density' | 'dwellTime'>('totalFootfall');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const response = await fetchZones(sortBy);
            setZones(response.data);
            setLoading(false);
        };
        loadData();
    }, [sortBy]);

    if (loading) {
        return (
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-800 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-16 bg-slate-800 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const formatDwellTime = (seconds: number) => {
        if (seconds < 60) return `${seconds}s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
        return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
    };

    return (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Zone Performance</h2>
                    <p className="text-slate-400">Analyze zone density and dwell patterns</p>
                </div>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                    <option value="totalFootfall">Sort by Footfall</option>
                    <option value="density">Sort by Density</option>
                    <option value="dwellTime">Sort by Dwell Time</option>
                </select>
            </div>

            <div className="space-y-3">
                {zones.map((zone, index) => (
                    <div
                        key={zone.id}
                        className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800/50 transition-all"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${index === 0 ? 'bg-gradient-to-br from-yellow-500 to-amber-600 text-white' :
                                        index === 1 ? 'bg-gradient-to-br from-slate-400 to-slate-500 text-white' :
                                            index === 2 ? 'bg-gradient-to-br from-orange-600 to-orange-700 text-white' :
                                                'bg-slate-700 text-slate-300'
                                    }`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{zone.name}</h3>
                                    <p className="text-xs text-slate-400">Zone ID: {zone.id}</p>
                                </div>
                            </div>

                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${zone.currentDensity > 1.5 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                    zone.currentDensity > 0.8 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                        'bg-green-500/20 text-green-400 border border-green-500/30'
                                }`}>
                                {zone.currentDensity > 1.5 ? 'High Density' : zone.currentDensity > 0.8 ? 'Moderate' : 'Low Density'}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <div className="text-xs text-slate-400 mb-1">Total Footfall</div>
                                <div className="text-xl font-bold text-white">{zone.totalFootfall.toLocaleString()}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 mb-1">Avg Dwell Time</div>
                                <div className="text-xl font-bold text-white">{formatDwellTime(zone.avgDwellTime)}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 mb-1">Density</div>
                                <div className="text-xl font-bold text-white">{zone.currentDensity.toFixed(1)} p/m²</div>
                            </div>
                        </div>

                        {/* Density Bar */}
                        <div className="mt-3">
                            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all ${zone.currentDensity > 1.5 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                                            zone.currentDensity > 0.8 ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
                                                'bg-gradient-to-r from-green-500 to-green-600'
                                        }`}
                                    style={{ width: `${Math.min(zone.currentDensity * 40, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
