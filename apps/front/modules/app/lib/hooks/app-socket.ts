'use client';
import { useAuth } from "@/modules/processes";
import { socketManager } from "@/modules/shared";
import { useEffect } from "react";

export const useAppSocket = () => {
    const { currentUser, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) return;

        if (currentUser?.id) {
            socketManager.connect(currentUser.id);
        } else {
            socketManager.disconnect();
        }
    }, [currentUser?.id, isAuthenticated]);

 
};
