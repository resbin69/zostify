'use client';

import { useState } from 'react';

export interface FilterState {
    dateRange: {
        start: Date;
        end: Date;
    };
    building: string;
    floor: string;
    granularity: '15m' | '1h' | '1d';
}

interface GlobalFiltersProps {
    onFilterChange: (filters: FilterState) => void;
}

export default function GlobalFilters({ onFilterChange }: GlobalFiltersProps) {
    const [filters, setFilters] = useState<FilterState>({
        dateRange: {
            start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            end: new Date(),
        },
        building: 'Building A',
        floor: 'Ground Floor',
        granularity: '1h',
    });

    const updateFilters = (updates: Partial<FilterState>) => {
        const newFilters = { ...filters, ...updates };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    return (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Date Range */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Date Range</label>
                    <select
                        className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        onChange={(e) => {
                            const days = parseInt(e.target.value);
                            updateFilters({
                                dateRange: {
                                    start: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
                                    end: new Date(),
                                },
                            });
                        }}
                    >
                        <option value="1">Last 24 Hours</option>
                        <option value="7" selected>Last 7 Days</option>
                        <option value="30">Last 30 Days</option>
                        <option value="90">Last 90 Days</option>
                    </select>
                </div>

                {/* Building Selector */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Building</label>
                    <select
                        className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        value={filters.building}
                        onChange={(e) => updateFilters({ building: e.target.value })}
                    >
                        <option>Building A</option>
                        <option>Building B</option>
                        <option>Building C</option>
                    </select>
                </div>

                {/* Floor Selector */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Floor</label>
                    <select
                        className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        value={filters.floor}
                        onChange={(e) => updateFilters({ floor: e.target.value })}
                    >
                        <option>Ground Floor</option>
                        <option>First Floor</option>
                        <option>Second Floor</option>
                    </select>
                </div>

                {/* Granularity */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Granularity</label>
                    <div className="flex gap-2">
                        {(['15m', '1h', '1d'] as const).map((gran) => (
                            <button
                                key={gran}
                                onClick={() => updateFilters({ granularity: gran })}
                                className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${filters.granularity === gran
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-slate-700/50'
                                    }`}
                            >
                                {gran}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
