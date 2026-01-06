'use client';
import { useAppDispatch } from '@/modules/app';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { XIcon } from 'lucide-react';
import { INotification, removeNotification } from '../model/NotificationSlice';
import { FC, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export interface INotificationToastProps {
    notification: INotification;
    index: number;
}

const AUTO_REMOVE_DELAY = 20000; // 20 секунд
const FADE_START_DELAY = 15000; // Начинаем уменьшать opacity за 5 секунд до удаления

export const NotificationToast: FC<INotificationToastProps> = ({ notification, index }) => {
    const dispatch = useAppDispatch();
    const [opacity, setOpacity] = useState(1);
    const [isRemoving, setIsRemoving] = useState(false);

    const handleRemoveNotification = useCallback(() => {
        setIsRemoving(true);
        setTimeout(() => {
            dispatch(removeNotification({ id: notification.id, type: notification.type }));
        }, 300); // Даем время на анимацию исчезновения
    }, [dispatch, notification.id, notification.type]);

    useEffect(() => {
        const startTime = Date.now();
        const fadeDuration = AUTO_REMOVE_DELAY - FADE_START_DELAY; // 5 секунд на затухание

        // Автоматическое удаление через 20 секунд
        const removeTimer = setTimeout(() => {
            handleRemoveNotification();
        }, AUTO_REMOVE_DELAY);

        // Прогрессивное уменьшение opacity начиная с 15 секунды
        const fadeInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;

            if (elapsed >= FADE_START_DELAY) {
                const fadeProgress = Math.min((elapsed - FADE_START_DELAY) / fadeDuration, 1);
                const newOpacity = 1 - (fadeProgress * 0.7); // От 1 до 0.3
                setOpacity(newOpacity);
            }
        }, 50); // Обновляем каждые 50мс для плавности

        return () => {
            clearTimeout(removeTimer);
            clearInterval(fadeInterval);
        };
    }, [handleRemoveNotification]);

    const topOffset = index * 16; // Смещение для наложения уведомлений (16px между уведомлениями)

    return (
        <AnimatePresence>
            {!isRemoving && (
                <motion.div
                    initial={{ opacity: 0, x: 400, scale: 0.8 }}
                    animate={{ opacity: opacity, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 400, scale: 0.8 }}
                    transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                        opacity: { duration: 0.3 }
                    }}
                    style={{
                        position: 'fixed',
                        top: `${16 + topOffset}px`,
                        right: '16px',
                        zIndex: 1000 - index,
                        width: '380px',
                        maxWidth: 'calc(100vw - 32px)',
                    }}
                    className="pointer-events-auto"
                >
                    <Card className="bg-card border shadow-lg hover:shadow-xl transition-shadow duration-200">
                        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
                            <div className="flex-1 min-w-0">
                                {notification.url ? (
                                    <Link
                                        href={notification.url}
                                        className="hover:underline"
                                        onClick={handleRemoveNotification}
                                    >
                                        <CardTitle className="text-base font-semibold leading-tight">
                                            {notification.title}
                                        </CardTitle>
                                    </Link>
                                ) : (
                                    <CardTitle className="text-base font-semibold leading-tight">
                                        {notification.title}
                                    </CardTitle>
                                )}
                            </div>
                            <button
                                onClick={handleRemoveNotification}
                                className="flex-shrink-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                                aria-label="Закрыть уведомление"
                            >
                                <XIcon className="h-4 w-4" />
                            </button>
                        </CardHeader>
                        <CardContent className="pt-0 pb-4">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {notification.message}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
