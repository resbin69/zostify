import { NextResponse } from 'next/server';
import { generateZones } from '@/lib/mockData';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sortBy') || 'totalFootfall';

    let zones = generateZones();

    // Sort zones based on query parameter
    zones.sort((a, b) => {
        if (sortBy === 'density') return b.currentDensity - a.currentDensity;
        if (sortBy === 'dwellTime') return b.avgDwellTime - a.avgDwellTime;
        return b.totalFootfall - a.totalFootfall;
    });

    return NextResponse.json({
        success: true,
        data: zones,
        metadata: {
            totalZones: zones.length,
            sortBy,
        },
    });
}
