import { NextResponse } from 'next/server';
import { generateFootfallData } from '@/lib/mockData';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const startDate = searchParams.get('startDate')
        ? new Date(searchParams.get('startDate')!)
        : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const endDate = searchParams.get('endDate')
        ? new Date(searchParams.get('endDate')!)
        : new Date();

    const granularity = (searchParams.get('granularity') || '1h') as '15m' | '1h' | '1d';

    const data = generateFootfallData(startDate, endDate, granularity);

    return NextResponse.json({
        success: true,
        data,
        metadata: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            granularity,
            totalRecords: data.length,
        },
    });
}
