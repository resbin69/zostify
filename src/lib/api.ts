// API client for fetching analytics data

const API_BASE = '/api';

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    metadata?: Record<string, any>;
}

export async function fetchFootfallData(
    startDate?: Date,
    endDate?: Date,
    granularity: '15m' | '1h' | '1d' = '1h'
) {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate.toISOString());
    if (endDate) params.set('endDate', endDate.toISOString());
    params.set('granularity', granularity);

    const response = await fetch(`${API_BASE}/analytics/footfall?${params}`);
    return response.json();
}

export async function fetchZones(sortBy: 'totalFootfall' | 'density' | 'dwellTime' = 'totalFootfall') {
    const params = new URLSearchParams({ sortBy });
    const response = await fetch(`${API_BASE}/analytics/zones?${params}`);
    return response.json();
}

export async function fetchFlowData() {
    const response = await fetch(`${API_BASE}/analytics/flow`);
    return response.json();
}

export async function fetchSafetyAlerts() {
    const response = await fetch(`${API_BASE}/alerts/safety`);
    return response.json();
}
