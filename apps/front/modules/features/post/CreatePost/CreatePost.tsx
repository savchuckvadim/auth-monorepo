'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useRef } from "react";
import { Textarea } from "@workspace/ui/components/textarea";
import { useAuth } from "@/modules/processes";
import { Button } from "@workspace/ui/components/button";
import { Camera, Send } from "lucide-react";
import { useMediaUpload } from "./lib/useMediaUpload";
import { useCamera } from "./lib/useCamera";
import { useCreatePostForm } from "./lib/useCreatePostForm";
import { MediaPreview } from "./ui/MediaPreview";
import { CameraView } from "./ui/CameraView";
import { postService } from "@/modules/entities";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { useAppDispatch, useAppSelector } from "@/modules/app";
import { createPostActions } from "./model/slice/CreatePostSlice";
import { MediaChoiceModal } from "@/modules/shared";

interface CreatePostProps {
    wallUserId?: string;  // На чьей стене создаем пост (если не указано - на своей)
}

export const CreatePost = ({ wallUserId }: CreatePostProps = {}) => {
    const { currentUser } = useAuth();
    const dispatch = useAppDispatch();
    const isMediaChoiceModalOpen = useAppSelector((state) => state.createPost.isMediaChoiceModalOpen);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraViewRef = useRef<HTMLDivElement>(null);

    const {
        mediaUrl,
        mediaType,
        isUploadingMedia,
        handleFileChange,
        removeMedia,
        setMedia,
    } = useMediaUpload();

    const {
        videoRef,
        mediaStreamRef,
        isCameraActive,
        isRecording,
        facingMode,
        startCamera,
        stopCamera,
        switchCamera,
        startRecording,
        stopRecording,
        cleanup,
    } = useCamera();

    const {
        register,
        handleSubmit,
        errors,
        isFocused,
        isLoading,
        error,
        handleFocus,
        handleBlur,
        onSubmit: handleFormSubmit,
    } = useCreatePostForm({
        wallUserId,
        mediaUrl,
        mediaType,
        onSuccess: () => {
            removeMedia();
            stopCamera();
        },
    });

    const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        await handleFileChange(file);

        // Сбрасываем input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleCameraButtonClick = async () => {
        console.log('📷 Camera button clicked, isCameraActive:', isCameraActive, 'isRecording:', isRecording);

        // Если камера уже открыта, управляем записью
        if (isCameraActive) {
            if (isRecording) {
                console.log('⏹️ Stopping recording...');
                stopRecording();
            } else {
                console.log('▶️ Starting recording...');
                startRecording(async (blob) => {
                    // Загружаем записанное видео
                    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
                    const fileName = isIOS ? 'video.mp4' : 'video.webm';
                    const fileType = isIOS ? 'video/mp4' : 'video/webm';
                    const file = new File([blob], fileName, { type: fileType });
                    try {
                        const { url } = await postService.uploadPostMedia(file);
                        setMedia(url, 'video');
                    } catch (error) {
                        console.error('Failed to upload video:', error);
                    } finally {
                        stopCamera();
                    }
                });
            }
            return;
        }

        // Открываем модальное окно выбора
        dispatch(createPostActions.openMediaChoiceModal());
        handleFocus();
    };

    const handleRemoveMedia = () => {
        removeMedia();
        stopCamera();
    };

    const handleChooseCamera = async () => {
        console.log('🎥 User chose camera, starting...');
        await startCamera();
        // Скролл произойдет автоматически через useEffect при изменении isCameraActive
    };

    const handleChooseFile = () => {
        // Открываем выбор файла
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleCloseModal = () => {
        dispatch(createPostActions.closeMediaChoiceModal());
    };

    // Автоматический скролл к предпросмотру видео при активации камеры
    useEffect(() => {
        if (isCameraActive && !mediaUrl && cameraViewRef.current) {
            // Небольшая задержка для рендера компонента
            const timer = setTimeout(() => {
                cameraViewRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [isCameraActive, mediaUrl]);

    // Очищаем при размонтировании
    useEffect(() => {
        return () => {
            cleanup();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='bg-card flex flex-row items-start justify-center min-w-full p-4 border rounded-xl mb-4'>

            <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="flex flex-col items-start justify-start w-full"
            >
                <div className="flex flex-col gap-2 w-full">
                    <div className="flex flex-row items-start justify-start gap-2 w-full">
                        {/* <Avatar
                            src={currentUser?.avatarUrl || ''}
                            alt={currentUser?.name || ''}
                            name={currentUser?.name || ''}
                            size="md"
                            className="mr-2"
                        /> */}
                        <Avatar>
                            <AvatarImage src={currentUser?.avatarUrl as string || ''} />
                            <AvatarFallback>{currentUser?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Textarea
                            {...register("content")}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            placeholder="Content"
                            disabled={isLoading || isUploadingMedia}
                            className={`w-full transition-all ${isFocused ? 'min-h-[120px]' : 'min-h-[60px]'}`}
                        />
                        <div className="flex flex-col gap-2">
                            {isFocused && (
                                <Button
                                    type="submit"
                                    disabled={isLoading || isUploadingMedia}
                                    size="sm"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            )}
                            <Button
                                type="button"
                                disabled={isLoading || isUploadingMedia}
                                variant="outline"
                                onClick={handleCameraButtonClick}
                                size="sm"
                            >
                                <Camera className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>



                    {error && <div className="text-red-500">{error.message}</div>}
                </div>

                <div className="flex flex-col gap-2 w-full mt-4">

                    {/* Превью медиа */}
                    {mediaUrl && mediaType && (
                        <MediaPreview
                            mediaUrl={mediaUrl}
                            mediaType={mediaType}
                            onRemove={handleRemoveMedia}
                        />
                    )}

                    {/* Видео с камеры */}
                    {isCameraActive && !mediaUrl && (
                        <div ref={cameraViewRef}>
                            <CameraView
                                videoRef={videoRef}
                                isRecording={isRecording}
                                facingMode={facingMode}
                                onStartRecording={() => {
                                    if (!mediaStreamRef.current) {
                                        console.error('Cannot start recording: media stream is not available');
                                        return;
                                    }
                                    startRecording(async (blob) => {
                                        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
                                        const fileName = isIOS ? 'video.mp4' : 'video.webm';
                                        const fileType = isIOS ? 'video/mp4' : 'video/webm';
                                        const file = new File([blob], fileName, { type: fileType });
                                        try {
                                            const { url } = await postService.uploadPostMedia(file);
                                            setMedia(url, 'video');
                                        } catch (error) {
                                            console.error('Failed to upload video:', error);
                                        } finally {
                                            stopCamera();
                                        }
                                    });
                                }}
                                onStopRecording={stopRecording}
                                onSwitchCamera={switchCamera}
                                onCancel={stopCamera}
                            />
                        </div>
                    )}
                </div>
                {/* Скрытый input для выбора файлов */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*,audio/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                    capture="environment"
                />
            </form>

            {/* Модальное окно выбора источника медиа */}
            <MediaChoiceModal
                open={isMediaChoiceModalOpen}
                onClose={handleCloseModal}
                onChooseCamera={handleChooseCamera}
                onChooseFile={handleChooseFile}
            />
        </div>
    );
};
