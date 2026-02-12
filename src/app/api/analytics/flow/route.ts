import { NextResponse } from 'next/server';
import { generateFlowData } from '@/lib/mockData';

export async function GET() {
    const data = generateFlowData();

    return NextResponse.json({
        success: true,
        data,
        metadata: {
            totalFlows: data.length,
        },
    });
}
