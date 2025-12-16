'use client';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { initializeApp } from '../../model/thunk/AppThunk';



export const useApp = () => {
    const dispatch = useAppDispatch();
    const app = useAppSelector(state => state.app);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

    }, []);

    useEffect(() => {

        if (isClient && !app.initialized && !app.isLoading) {
            dispatch(initializeApp());
        }


    }, [isClient, app.initialized, app.isLoading, dispatch]);



    return {
        isClient,

        app,
        initialized: app.initialized,
        isLoading: app.isLoading,

    };
};
