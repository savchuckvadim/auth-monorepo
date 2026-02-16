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
import { Camera, Upload } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';

interface MediaChoiceModalProps {
    open: boolean;
    onClose: () => void;
    onChooseCamera: () => void;
    onChooseFile: () => void;
}

export const MediaChoiceModal: React.FC<MediaChoiceModalProps> = ({
    open,
    onClose,
    onChooseCamera,
    onChooseFile,
}) => {
    const handleCameraClick = () => {
        onChooseCamera();
        onClose();
    };

    const handleFileClick = () => {
        onChooseFile();
        onClose();
    };

    return (
        <>
            {/* Глобальные стили для blur backdrop */}
            <style jsx global>{`
                [data-slot="dialog-overlay"] {
                    backdrop-filter: blur(12px) !important;
                    -webkit-backdrop-filter: blur(12px) !important;
                    background-color: rgba(0, 0, 0, 0.6) !important;
                }
            `}</style>

            <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
                <DialogContent
                    className="sm:max-w-md"
                    showCloseButton={true}
                >
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">
                            Выберите источник медиа
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Использовать камеру для съемки или выбрать файл с устройства?
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-3 py-4">
                        <Button
                            onClick={handleCameraClick}
                            variant="outline"
                            className={cn(
                                "w-full h-auto p-6 flex flex-col items-center justify-center gap-3",
                                "hover:bg-accent transition-colors"
                            )}
                        >
                            <Camera className="h-8 w-8 text-primary" />
                            <div className="flex flex-col items-center gap-1">
                                <span className="font-semibold text-base">Использовать камеру</span>
                                <span className="text-sm text-muted-foreground">
                                    Снять фото или видео
                                </span>
                            </div>
                        </Button>

                        <Button
                            onClick={handleFileClick}
                            variant="outline"
                            className={cn(
                                "w-full h-auto p-6 flex flex-col items-center justify-center gap-3",
                                "hover:bg-accent transition-colors"
                            )}
                        >
                            <Upload className="h-8 w-8 text-primary" />
                            <div className="flex flex-col items-center gap-1">
                                <span className="font-semibold text-base">Выбрать файл</span>
                                <span className="text-sm text-muted-foreground">
                                    Загрузить с устройства
                                </span>
                            </div>
                        </Button>
                    </div>

                    <DialogFooter>
                        <Button
                            onClick={onClose}
                            variant="ghost"
                            className="w-full"
                        >
                            Отмена
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
