'use client';


import { LoadingScreen } from '@/modules/shared';
import { useLivekitToken } from './useLivekitToken';
import { VideoCall } from '@/modules/features/call/ui/LiveKitTest';


export default function CallsPage() {
    const { data, isLoading, error } = useLivekitToken('room1');
    if (isLoading) {
        return <LoadingScreen />
    }
    if (error) {
        return <div>Error: {error.message}</div>
    }
    if (!data || !data.token) {
        return <div>No data</div>
    }
    return (
        <div>
            {data.token && <VideoCall token={data.token} />}
        </div>

    );
}
