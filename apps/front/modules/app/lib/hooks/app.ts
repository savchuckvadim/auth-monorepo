'use client';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { initializeApp } from '../../model/thunk/AppThunk';


export const useApp = () => {
    const dispatch = useAppDispatch();
    const app = useAppSelector(state => state.app);
    const [isClient, setIsClient] = useState(false);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {

        if (isClient && !app.initialized && !app.isLoading) {
            dispatch(initializeApp());
        }

        if (isClient && app.initialized && !app.isLoading) {
            if (!ready) {
                setReady(true);
            }
        } else {
            if (ready) {
                setReady(false);
            }
        }
    }, [isClient, app.initialized, app.isLoading, dispatch]);



    return {
        isClient,
        ready,
        // hasCompany,
        app,
        initialized: app.initialized,
        isLoading: app.isLoading,

    };
};
export const useReload = () => {
    const dispatch = useAppDispatch();
    const { isLoading } = useAppSelector(state => state.app);
    const reload = () => {
        // dispatch(reloadApp());
    };
    return { reload, isLoading };
};
