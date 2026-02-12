'use client';

import { useEffect, useState, useRef } from 'react';
import { fetchZones } from '@/lib/api';
import { Zone } from '@/lib/mockData';

export default function HeatmapOverlay() {
    const [zones, setZones] = useState<Zone[]>([]);
    const [loading, setLoading] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const response = await fetchZones();
            setZones(response.data);
            setLoading(false);
        };
        loadData();
    }, []);

    useEffect(() => {
        if (!canvasRef.current || zones.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw zones with heatmap colors
        zones.forEach(zone => {
            // Calculate color based on density (blue -> yellow -> red)
            const density = zone.currentDensity;
            let color;

            if (density < 0.5) {
                // Blue to Green
                const ratio = density / 0.5;
                color = `rgba(59, 130, 246, ${0.3 + ratio * 0.2})`;
            } else if (density < 1.0) {
                // Green to Yellow
                const ratio = (density - 0.5) / 0.5;
                color = `rgba(${59 + ratio * 196}, ${130 + ratio * 70}, ${246 - ratio * 146}, ${0.5 + ratio * 0.2})`;
            } else if (density < 1.5) {
                // Yellow to Orange
                const ratio = (density - 1.0) / 0.5;
                color = `rgba(${255}, ${200 - ratio * 55}, ${100 - ratio * 100}, ${0.7 + ratio * 0.1})`;
            } else {
                // Orange to Red
                const ratio = Math.min((density - 1.5) / 1.0, 1);
                color = `rgba(${255}, ${145 - ratio * 145}, 0, ${0.8 + ratio * 0.2})`;
            }

            // Draw polygon
            ctx.fillStyle = color;
            ctx.strokeStyle = density > 1.5 ? '#ef4444' : density > 0.8 ? '#f59e0b' : '#3b82f6';
            ctx.lineWidth = 2;

            ctx.beginPath();
            zone.polygon.forEach((point, index) => {
                if (index === 0) {
                    ctx.moveTo(point[0], point[1]);
                } else {
                    ctx.lineTo(point[0], point[1]);
                }
            });
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Draw zone label
            const centerX = zone.polygon.reduce((sum, p) => sum + p[0], 0) / zone.polygon.length;
            const centerY = zone.polygon.reduce((sum, p) => sum + p[1], 0) / zone.polygon.length;

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(zone.name, centerX, centerY - 5);

            ctx.font = '10px Inter, sans-serif';
            ctx.fillText(`${zone.currentDensity.toFixed(1)} p/m²`, centerX, centerY + 10);
        });
    }, [zones]);

    if (loading) {
        return (
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-800 rounded w-1/3 mb-4"></div>
                    <div className="h-96 bg-slate-800 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Zone Heatmap</h2>
                <p className="text-slate-400">Real-time density visualization across zones</p>
            </div>

            {/* Heatmap Canvas */}
            <div className="relative bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={300}
                    className="w-full h-auto"
                />
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-500"></div>
                    <span className="text-sm text-slate-300">Low (0-0.5)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-yellow-500"></div>
                    <span className="text-sm text-slate-300">Medium (0.5-1.0)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-orange-500"></div>
                    <span className="text-sm text-slate-300">High (1.0-1.5)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-500"></div>
                    <span className="text-sm text-slate-300">Critical (1.5+)</span>
                </div>
            </div>
        </div>
    );
}
