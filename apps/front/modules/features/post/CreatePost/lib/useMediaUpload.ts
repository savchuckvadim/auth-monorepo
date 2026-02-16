'use client';
import { useState } from "react";
import { postService } from "@/modules/entities";


export type MediaType = 'image' | 'video' | 'audio' | null;

export const useMediaUpload = () => {
    const [mediaUrl, setMediaUrl] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<MediaType>(null);
    const [isUploadingMedia, setIsUploadingMedia] = useState(false);

    const handleFileChange = async (file: File): Promise<void> => {
        if (file.type.startsWith('image/')) {
            setIsUploadingMedia(true);
            try {
                const { url } = await postService.uploadPostMedia(file);
                setMediaUrl(url);
                setMediaType('image');
            } catch (error) {
                console.error('Failed to upload image:', error);
                throw error;
            } finally {
                setIsUploadingMedia(false);
            }
        } else if (file.type.startsWith('video/')) {
            // Для видео сначала проверяем длительность
            const video = document.createElement('video');
            video.src = URL.createObjectURL(file);
            video.onloadedmetadata = () => {
                const duration = video.duration;
                if (duration > 20) {
                    alert('Видео должно быть не более 20 секунд');
                    URL.revokeObjectURL(video.src);
                    return;
                }
                // Загружаем видео
                setIsUploadingMedia(true);
                postService.uploadPostMedia(file)
                    .then(({ url }) => {
                        setMediaUrl(url);
                        setMediaType('video');
                    })
                    .catch((error) => {
                        console.error('Failed to upload video:', error);
                    })
                    .finally(() => {
                        setIsUploadingMedia(false);
                        URL.revokeObjectURL(video.src);
                    });
            };
        } else if (file.type.startsWith('audio/')) {
            setIsUploadingMedia(true);
            try {
                const { url } = await postService.uploadPostMedia(file);
                setMediaUrl(url);
                setMediaType('audio');
            } catch (error) {
                console.error('Failed to upload audio:', error);
                throw error;
            } finally {
                setIsUploadingMedia(false);
            }
        }
    };

    const removeMedia = () => {
        setMediaUrl(null);
        setMediaType(null);
    };

    const setMedia = (url: string | null, type: MediaType) => {
        setMediaUrl(url);
        setMediaType(type);
    };

    return {
        mediaUrl,
        mediaType,
        isUploadingMedia,
        handleFileChange,
        removeMedia,
        setMedia,
    };
};

