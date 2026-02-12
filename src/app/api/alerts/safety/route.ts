import { NextResponse } from 'next/server';
import { generateAlerts } from '@/lib/mockData';

export async function GET() {
    const alerts = generateAlerts();

    return NextResponse.json({
        success: true,
        data: alerts,
        metadata: {
            totalAlerts: alerts.length,
            activeAlerts: alerts.filter(a => a.severity === 'high').length,
        },
    });
}
