'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@workspace/ui/components/dialog';
import { Button } from '@workspace/ui/components/button';
import { AlertCircle, Camera, Mic, Shield, Settings } from 'lucide-react';
import { ICallError } from '../model/slice/CallSlice';

interface CallErrorModalProps {
    error: ICallError | null;
    onClose: () => void;
}

const getErrorIcon = (type: ICallError['type']) => {
    switch (type) {
        case 'PERMISSION_DENIED':
            return <Shield className="h-6 w-6 text-destructive" />;
        case 'DEVICE_NOT_FOUND':
            return <Camera className="h-6 w-6 text-destructive" />;
        case 'DEVICE_IN_USE':
            return <Camera className="h-6 w-6 text-destructive" />;
        case 'HTTPS_REQUIRED':
            return <Shield className="h-6 w-6 text-destructive" />;
        default:
            return <AlertCircle className="h-6 w-6 text-destructive" />;
    }
};

const getErrorTitle = (type: ICallError['type']) => {
    switch (type) {
        case 'PERMISSION_DENIED':
            return 'Доступ отклонен';
        case 'DEVICE_NOT_FOUND':
            return 'Устройство не найдено';
        case 'DEVICE_IN_USE':
            return 'Устройство занято';
        case 'HTTPS_REQUIRED':
            return 'Требуется безопасное соединение';
        default:
            return 'Ошибка доступа к медиа';
    }
};

const getInstructions = (type: ICallError['type']) => {
    switch (type) {
        case 'PERMISSION_DENIED':
            return (
                <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Чтобы разрешить доступ:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                        <li>Нажмите на иконку замка или информации в адресной строке</li>
                        <li>Найдите раздел "Камера" и "Микрофон"</li>
                        <li>Выберите "Разрешить"</li>
                        <li>Обновите страницу и попробуйте снова</li>
                    </ol>
                </div>
            );
        case 'HTTPS_REQUIRED':
            return (
                <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Для видеозвонков требуется безопасное HTTPS соединение.</p>
                    <p>Обратитесь к администратору для настройки SSL сертификата.</p>
                </div>
            );
        case 'DEVICE_IN_USE':
            return (
                <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Ваша камера или микрофон используется другим приложением.</p>
                    <p>Закройте другие приложения (Skype, Zoom, Teams и т.д.) и попробуйте снова.</p>
                </div>
            );
        case 'DEVICE_NOT_FOUND':
            return (
                <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Убедитесь, что:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Камера и микрофон подключены</li>
                        <li>Устройства не заблокированы системой</li>
                        <li>Драйверы устройств установлены</li>
                    </ul>
                </div>
            );
        default:
            return null;
    }
};

export const CallErrorModal: React.FC<CallErrorModalProps> = ({ error, onClose }) => {
    if (!error) return null;

    const icon = getErrorIcon(error.type);
    const title = getErrorTitle(error.type);
    const instructions = getInstructions(error.type);

    return (
        <Dialog open={!!error} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {icon}
                        {title}
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                        {error.message}
                    </DialogDescription>
                </DialogHeader>

                {instructions && (
                    <div className="py-4">
                        {instructions}
                    </div>
                )}

                <DialogFooter>
                    <Button onClick={onClose} variant="default">
                        Понятно
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

