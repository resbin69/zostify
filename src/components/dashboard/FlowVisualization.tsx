'use client';

import { useEffect, useState } from 'react';
import { fetchFlowData, fetchZones } from '@/lib/api';
import { FlowData, Zone } from '@/lib/mockData';

export default function FlowVisualization() {
    const [flowData, setFlowData] = useState<FlowData[]>([]);
    const [zones, setZones] = useState<Zone[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const [flowResponse, zonesResponse] = await Promise.all([
                fetchFlowData(),
                fetchZones(),
            ]);
            setFlowData(flowResponse.data);
            setZones(zonesResponse.data);
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-800 rounded w-1/3 mb-4"></div>
                    <div className="h-64 bg-slate-800 rounded"></div>
                </div>
            </div>
        );
    }

    const getZoneName = (zoneId: string) => {
        return zones.find(z => z.id === zoneId)?.name || zoneId;
    };

    const maxCount = Math.max(...flowData.map(f => f.count));

    return (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Flow & Pathing</h2>
                <p className="text-slate-400">Visualize movement patterns between zones</p>
            </div>

            <div className="space-y-3">
                {flowData
                    .sort((a, b) => b.count - a.count)
                    .map((flow, index) => {
                        const percentage = (flow.count / maxCount) * 100;

                        return (
                            <div
                                key={`${flow.source}-${flow.target}`}
                                className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800/50 transition-all"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="flex items-center gap-2 flex-1">
                                            <div className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                                                <span className="text-sm font-medium text-blue-300">{getZoneName(flow.source)}</span>
                                            </div>

                                            <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>

                                            <div className="px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                                                <span className="text-sm font-medium text-purple-300">{getZoneName(flow.target)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ml-4">
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-white">{flow.count}</div>
                                            <div className="text-xs text-slate-400">visitors</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Flow Bar */}
                                <div className="relative">
                                    <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        >
                                            <div className="h-full w-full animate-pulse opacity-50 bg-white"></div>
                                        </div>
                                    </div>
                                    <div className="absolute -top-1 right-0 text-xs text-slate-400">
                                        {percentage.toFixed(0)}% of max flow
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>

            {/* Summary Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4">
                    <div className="text-sm text-slate-400 mb-1">Total Flows Tracked</div>
                    <div className="text-2xl font-bold text-white">{flowData.length}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-4">
                    <div className="text-sm text-slate-400 mb-1">Total Movements</div>
                    <div className="text-2xl font-bold text-white">
                        {flowData.reduce((sum, f) => sum + f.count, 0).toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    );
}
