'use client';

import { useState, useRef, useEffect } from "react"
import { Textarea } from "@workspace/ui/components/textarea"
import { useForm } from "react-hook-form"
import { useCreatePost } from "../lib/hook/post.hook"
import { useAuth } from "@/modules/processes"
import { Avatar } from "@/modules/shared"
import { Button } from "@workspace/ui/components/button"
import { Camera, Send } from "lucide-react"
import { postService } from "../lib/api/post.service"
import Image from "next/image";

export const CreatePost = () => {
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm()
    const { mutate: createPost, isPending: isLoading, error } = useCreatePost()
    const { currentUser } = useAuth()
    const [isFocused, setIsFocused] = useState(false)
    const [mediaUrl, setMediaUrl] = useState<string | null>(null)
    const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null)
    const [isUploadingMedia, setIsUploadingMedia] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const mediaStreamRef = useRef<MediaStream | null>(null)
    const [isRecording, setIsRecording] = useState(false)
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)

    const content = watch("content")

    const handleFocus = () => {
        setIsFocused(true)
    }

    const handleBlur = () => {
        // Не убираем фокус сразу, если есть текст или медиа
        if (!content && !mediaUrl) {
            setIsFocused(false)
        }
    }

    const handleCameraClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Проверяем тип файла
        if (file.type.startsWith('image/')) {
            setIsUploadingMedia(true)
            try {
                const { url } = await postService.uploadPostMedia(file)
                setMediaUrl(url)
                setMediaType('image')
            } catch (error) {
                console.error('Failed to upload image:', error)
            } finally {
                setIsUploadingMedia(false)
            }
        } else if (file.type.startsWith('video/')) {
            // Для видео сначала показываем превью и записываем
            const video = document.createElement('video')
            video.src = URL.createObjectURL(file)
            video.onloadedmetadata = () => {
                const duration = video.duration
                if (duration > 20) {
                    alert('Видео должно быть не более 20 секунд')
                    return
                }
                // Загружаем видео
                setIsUploadingMedia(true)
                postService.uploadPostMedia(file)
                    .then(({ url }) => {
                        setMediaUrl(url)
                        setMediaType('video')
                    })
                    .catch((error) => {
                        console.error('Failed to upload video:', error)
                    })
                    .finally(() => {
                        setIsUploadingMedia(false)
                    })
            }
        }

        // Сбрасываем input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
                audio: true
            })
            mediaStreamRef.current = stream
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                videoRef.current.play()
            }
        } catch (error) {
            console.error('Error accessing camera:', error)
            alert('Не удалось получить доступ к камере')
        }
    }

    const stopCamera = () => {
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop())
            mediaStreamRef.current = null
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null
        }
    }

    const startRecording = () => {
        if (!mediaStreamRef.current) return

        const mediaRecorder = new MediaRecorder(mediaStreamRef.current, {
            mimeType: 'video/webm;codecs=vp8,opus'
        })
        mediaRecorderRef.current = mediaRecorder
        const chunks: Blob[] = []

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunks.push(e.data)
            }
        }

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' })
            setRecordedBlob(blob)

            // Проверяем длительность
            const video = document.createElement('video')
            video.src = URL.createObjectURL(blob)
            video.onloadedmetadata = () => {
                const duration = video.duration
                if (duration > 20) {
                    alert('Видео должно быть не более 20 секунд')
                    setRecordedBlob(null)
                    return
                }

                // Загружаем видео
                setIsUploadingMedia(true)
                const file = new File([blob], 'video.webm', { type: 'video/webm' })
                postService.uploadPostMedia(file)
                    .then(({ url }) => {
                        setMediaUrl(url)
                        setMediaType('video')
                    })
                    .catch((error) => {
                        console.error('Failed to upload video:', error)
                    })
                    .finally(() => {
                        setIsUploadingMedia(false)
                        stopCamera()
                    })
            }
        }

        mediaRecorder.start()
        setIsRecording(true)

        // Автоматически останавливаем через 20 секунд
        recordingTimerRef.current = setTimeout(() => {
            stopRecording()
        }, 20000)
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
        }
        if (recordingTimerRef.current) {
            clearTimeout(recordingTimerRef.current)
            recordingTimerRef.current = null
        }
    }

    const handleCameraButtonClick = async () => {
        // Если камера уже открыта, управляем записью
        if (mediaStreamRef.current) {
            if (isRecording) {
                stopRecording()
            } else {
                startRecording()
            }
            return
        }

        // Иначе предлагаем выбор: камера или файл
        const useCamera = window.confirm('Использовать камеру? (OK - камера, Отмена - выбрать файл)')
        if (useCamera) {
            await startCamera()
        } else {
            // Открываем выбор файла
            if (fileInputRef.current) {
                fileInputRef.current.click()
            }
        }
        handleFocus();
    }

    const removeMedia = () => {
        setMediaUrl(null)
        setMediaType(null)
        setRecordedBlob(null)
        stopCamera()
    }

    const onSubmit = (data: any) => {
        createPost({
            text: data.content && data.content.trim() ? data.content.trim() : undefined,
            image: mediaType === 'image' && mediaUrl ? mediaUrl : undefined,
            video: mediaType === 'video' && mediaUrl ? mediaUrl : undefined,
        }, {
            onSuccess: () => {
                // Очищаем форму только после успешного создания
                reset()
                setMediaUrl(null)
                setMediaType(null)
                setIsFocused(false)
                stopCamera()
            },
            onError: (error: Error) => {
                console.error('Failed to create post:', error)
            }
        })
    }

    // Очищаем при размонтировании
    useEffect(() => {
        return () => {
            stopCamera()
            if (recordingTimerRef.current) {
                clearTimeout(recordingTimerRef.current)
            }
        }
    }, [])

    return (
        <div className='bg-card flex flex-row items-start justify-center min-w-full p-4 border rounded-xl mb-4'>
            <Avatar
                src={currentUser?.avatarUrl || ''}
                alt={currentUser?.name || ''}
                name={currentUser?.name || ''}
                size="md"
                className="mr-2"
            />
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col items-start justify-start w-full"
            >
                <div className="flex flex-col gap-2 w-full">
                    <div className="flex flex-row items-start justify-start gap-2 w-full">
                        <Textarea
                            {...register("content")}
                            ref={(e) => {
                                register("content").ref(e)
                                textareaRef.current = e
                            }}
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

                    {/* Превью медиа */}
                    {mediaUrl && (




                        <div className="relative w-full">
                            {mediaType === 'image' && (
                                // <img
                                //     src={mediaUrl}
                                //     alt="Preview"
                                //     className="max-w-full max-h-64 rounded-md"
                                // />

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
                                <video
                                    src={mediaUrl}
                                    controls
                                    className="max-w-full max-h-64 rounded-md"
                                />
                            )}
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={removeMedia}
                                className="absolute top-2 right-2"
                            >
                                ×
                            </Button>
                        </div>
                    )}

                    {/* Видео с камеры */}
                    {mediaStreamRef.current && !mediaUrl && (
                        <div className="relative w-full">
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                className="max-w-full max-h-64 rounded-md"
                            />
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                {!isRecording ? (
                                    <Button
                                        type="button"
                                        onClick={startRecording}
                                        variant="default"
                                    >
                                        Начать запись
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={stopRecording}
                                        variant="destructive"
                                    >
                                        Остановить
                                    </Button>
                                )}
                                <Button
                                    type="button"
                                    onClick={stopCamera}
                                    variant="outline"
                                >
                                    Отмена
                                </Button>
                            </div>
                        </div>
                    )}

                    {error && <div className="text-red-500">{error.message}</div>}
                </div>

                {/* Скрытый input для выбора файлов */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                    capture="environment"
                />
            </form>
        </div>
    )
}
