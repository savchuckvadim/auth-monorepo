'use client';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { initializeApp } from '../../model/thunk/AppThunk';
import { usePostsSocket } from '@/modules/entities/post/lib/hook/post-socket.hook';



export const useApp = () => {
    const dispatch = useAppDispatch();
    const app = useAppSelector(state => state.app);
    const [isClient, setIsClient] = useState(false);


    // подписываемся на события постов
    usePostsSocket();

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
