'use client';

import Image from 'next/image';
import { Button } from '@workspace/ui/components/button';
import { X } from 'lucide-react';
import { MediaType } from '../lib/useMediaUpload';
import { AudioPlayer } from './AudioPlayer';

interface MediaPreviewProps {
    mediaUrl: string;
    mediaType: MediaType;
    onRemove: () => void;
}

export const MediaPreview = ({ mediaUrl, mediaType, onRemove }: MediaPreviewProps) => {
    return (
        <div className="relative w-full">
            {mediaType === 'image' && (
                <div className='w-full mt-4 relative' style={{ aspectRatio: '4/3' }}>
                    <Image
                        src={mediaUrl}
                        alt='post image'
                        fill
                        className='object-cover rounded-2xl'
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                    />
                </div>
            )}
            {mediaType === 'video' && (
                <div className='w-full mt-4 relative' style={{ aspectRatio: '4/3' }}>
                    <video
                        src={mediaUrl}
                        controls
                        className='object-cover rounded-2xl w-full h-full'
                    />
                </div>
            )}
            {mediaType === 'audio' && (
                <div className='w-full mt-4'>
                    <AudioPlayer src={mediaUrl} />
                </div>
            )}
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="absolute top-2 right-2 bg-background/50 hover:bg-background/70"
            >
                <X className="w-4 h-4" />
            </Button>
        </div>
    );
};

