'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MediaType } from './useMediaUpload';
import { useCreatePost } from '@/modules/entities';

interface CreatePostFormData {
    content: string;
}

interface UseCreatePostFormProps {
    wallUserId?: string;
    mediaUrl: string | null;
    mediaType: MediaType;
    onSuccess?: () => void;
}

export const useCreatePostForm = ({
    wallUserId,
    mediaUrl,
    mediaType,
    onSuccess
}: UseCreatePostFormProps) => {
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<CreatePostFormData>();
    const { mutate: createPost, isPending: isLoading, error } = useCreatePost();
    const [isFocused, setIsFocused] = useState(false);

    const content = watch("content");

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        // Не убираем фокус сразу, если есть текст или медиа
        if (!content && !mediaUrl) {
            setIsFocused(false);
        }
    };

    const onSubmit = (data: CreatePostFormData) => {
        createPost({
            text: data.content && data.content.trim() ? data.content.trim() : undefined,
            image: mediaType === 'image' && mediaUrl ? mediaUrl : undefined,
            video: mediaType === 'video' && mediaUrl ? mediaUrl : undefined,
            audio: mediaType === 'audio' && mediaUrl ? mediaUrl : undefined,
            wallUserId: wallUserId,
        }, {
            onSuccess: () => {
                reset();
                setIsFocused(false);
                onSuccess?.();
            },
            onError: (error: Error) => {
                console.error('Failed to create post:', error);
            }
        });
    };

    return {
        register,
        handleSubmit,
        errors,
        reset,
        watch,
        isFocused,
        isLoading,
        error,
        handleFocus,
        handleBlur,
        onSubmit,
    };
};

