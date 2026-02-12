'use client';

import { useEffect, useState } from 'react';
import { fetchSafetyAlerts } from '@/lib/api';
import { Alert } from '@/lib/mockData';

export default function SafetyAlerts() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const response = await fetchSafetyAlerts();
            setAlerts(response.data);
            setLoading(false);
        };
        loadData();

        // Refresh alerts every 10 seconds
        const interval = setInterval(loadData, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-800 rounded w-1/3 mb-4"></div>
                    <div className="h-20 bg-slate-800 rounded"></div>
                </div>
            </div>
        );
    }

    if (alerts.length === 0) {
        return (
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-white mb-2">Safety Alerts</h2>
                    <p className="text-slate-400">Real-time congestion and safety monitoring</p>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div className="text-lg font-semibold text-green-400">All Clear</div>
                    <div className="text-sm text-slate-400 mt-1">No active safety alerts</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Safety Alerts</h2>
                    <p className="text-slate-400">Real-time congestion and safety monitoring</p>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/20 border border-red-500/30">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-sm font-medium text-red-400">{alerts.length} Active</span>
                </div>
            </div>

            <div className="space-y-3">
                {alerts.map((alert) => (
                    <div
                        key={alert.id}
                        className={`border rounded-xl p-4 ${alert.severity === 'high'
                                ? 'bg-red-500/10 border-red-500/30'
                                : alert.severity === 'medium'
                                    ? 'bg-amber-500/10 border-amber-500/30'
                                    : 'bg-blue-500/10 border-blue-500/30'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${alert.severity === 'high'
                                        ? 'bg-red-500/20'
                                        : alert.severity === 'medium'
                                            ? 'bg-amber-500/20'
                                            : 'bg-blue-500/20'
                                    }`}>
                                    <svg className={`w-5 h-5 ${alert.severity === 'high'
                                            ? 'text-red-400'
                                            : alert.severity === 'medium'
                                                ? 'text-amber-400'
                                                : 'text-blue-400'
                                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className={`font-semibold ${alert.severity === 'high'
                                                ? 'text-red-400'
                                                : alert.severity === 'medium'
                                                    ? 'text-amber-400'
                                                    : 'text-blue-400'
                                            }`}>
                                            {alert.type === 'congestion' ? 'Congestion Alert' : 'Queue Alert'}
                                        </h3>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${alert.severity === 'high'
                                                ? 'bg-red-500/30 text-red-300'
                                                : alert.severity === 'medium'
                                                    ? 'bg-amber-500/30 text-amber-300'
                                                    : 'bg-blue-500/30 text-blue-300'
                                            }`}>
                                            {alert.severity.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-300">{alert.message}</p>
                                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                                        <span>Zone: {alert.zoneName}</span>
                                        <span>•</span>
                                        <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
