'use client';

import { useApp } from '../lib/hooks/app';
import { LoadingScreen } from '@/modules/shared';

export const App = ({ children }: { children: React.ReactNode }) => {
    const { isLoading, isClient } = useApp();

    if (!isClient) {
        return <LoadingScreen />
    }

    return (
        <div className="h-calc(100vh - 300px)">
            {isLoading ? <LoadingScreen /> : children}
        </div>
    );
};

export default App;

