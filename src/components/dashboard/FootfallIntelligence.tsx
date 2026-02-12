'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchFootfallData } from '@/lib/api';
import { FootfallDataPoint } from '@/lib/mockData';

interface FootfallIntelligenceProps {
    granularity: '15m' | '1h' | '1d';
    dateRange: { start: Date; end: Date };
}

export default function FootfallIntelligence({ granularity, dateRange }: FootfallIntelligenceProps) {
    const [data, setData] = useState<FootfallDataPoint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const response = await fetchFootfallData(dateRange.start, dateRange.end, granularity);
            setData(response.data);
            setLoading(false);
        };
        loadData();
    }, [granularity, dateRange]);

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

    const totalInflow = data.reduce((sum, d) => sum + d.inflow, 0);
    const totalOutflow = data.reduce((sum, d) => sum + d.outflow, 0);
    const peakHour = data.reduce((max, d) => (d.inflow > max.inflow ? d : max), data[0]);

    return (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Footfall Intelligence</h2>
                <p className="text-slate-400">Track visitor flow and identify peak periods</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">Total Inflow</span>
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white">{totalInflow.toLocaleString()}</div>
                    <div className="text-xs text-green-400 mt-1">↑ 12.5% vs last period</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">Total Outflow</span>
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white">{totalOutflow.toLocaleString()}</div>
                    <div className="text-xs text-red-400 mt-1">↓ 8.3% vs last period</div>
                </div>

                <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">Peak Hour</span>
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white">{peakHour.inflow}</div>
                    <div className="text-xs text-slate-400 mt-1">{new Date(peakHour.timestamp).toLocaleTimeString()}</div>
                </div>
            </div>

            {/* Chart */}
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <defs>
                            <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                        <XAxis
                            dataKey="timestamp"
                            stroke="#94a3b8"
                            tickFormatter={(value) => new Date(value).toLocaleDateString()}
                        />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1e293b',
                                border: '1px solid #334155',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="inflow"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={false}
                            fill="url(#colorInflow)"
                        />
                        <Line
                            type="monotone"
                            dataKey="outflow"
                            stroke="#a855f7"
                            strokeWidth={3}
                            dot={false}
                            fill="url(#colorOutflow)"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
