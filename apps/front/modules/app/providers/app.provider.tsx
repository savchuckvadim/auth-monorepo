'use client';
import { Provider } from 'react-redux';
import { store } from '../model/store';
import { ErrorBoundary } from './error-boundry.provider';
import App from '../ui/App';

export function AppProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <ErrorBoundary>
                <App>{children}</App>
            </ErrorBoundary>
        </Provider>
    );
}
