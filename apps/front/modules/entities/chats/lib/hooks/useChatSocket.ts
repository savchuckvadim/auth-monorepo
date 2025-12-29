import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { connectMessagesSocket } from '@/modules/shared/lib/socket/messages-socket';
import { Message } from '@/modules/entities/messages';

interface UseChatSocketProps {
    chatId: string | null;
    userId: string | undefined;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export const useChatSocket = ({ chatId, userId, messagesEndRef }: UseChatSocketProps) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!userId || !chatId) return;

        const messagesSocket = connectMessagesSocket(userId);

        const handleNewMessage = (newMessage: Message) => {
            console.log('📨 New message received via WebSocket:', newMessage);
            console.log('📨 Current chatId:', chatId);
            console.log('📨 Message chatId:', newMessage.chatId);

            if (newMessage.chatId === chatId) {
                console.log('✅ Message is for current chat, updating cache');
                queryClient.setQueryData(
                    ['messages', 'chat', chatId, 50, 0],
                    (oldData: Message[] | undefined) => {
                        console.log('📝 Old data:', oldData?.length, 'messages');
                        if (!oldData) {
                            console.log('📝 No old data, returning new message');
                            return [newMessage];
                        }
                        const exists = oldData.some((msg: Message) => msg.id === newMessage.id);
                        if (exists) {
                            console.log('⚠️ Message already exists in cache');
                            return oldData;
                        }
                        const filtered = oldData.filter((msg: Message) =>
                            !(msg.id?.startsWith('temp-') && msg.content === newMessage.content && msg.senderId === newMessage.senderId)
                        );
                        console.log('📝 Adding new message to cache, total:', filtered.length + 1);
                        return [...filtered, newMessage];
                    }
                );

                queryClient.invalidateQueries({ queryKey: ['chats', 'user'] });

                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            } else {
                console.log('ℹ️ Message is for different chat, updating chat list only');
                queryClient.invalidateQueries({ queryKey: ['chats', 'user'] });
            }
        };

        messagesSocket.on('message:new', handleNewMessage);

        const onAnyHandler = (event: string, ...args: unknown[]) => {
            console.log('🔔 WebSocket event received:', event, args);
            if (event === 'message:new') {
                console.log('📨 message:new event detected!', args[0]);
            }
        };
        messagesSocket.onAny(onAnyHandler);

        messagesSocket.on('chat:joined', (data: { chatId?: string;[key: string]: unknown }) => {
            console.log('✅ Joined chat room:', data);
        });

        const joinChat = () => {
            console.log('📤 Joining chat:', chatId);
            messagesSocket.emit('chat:join', { chatId }, (response: { error?: string;[key: string]: unknown } | null) => {
                if (response?.error) {
                    console.error('❌ Chat join error:', response.error);
                } else {
                    console.log('✅ Chat join success:', response);
                }
            });
        };

        if (messagesSocket.connected) {
            console.log('✅ Messages socket already connected');
            joinChat();
        } else {
            const connectHandler = () => {
                console.log('✅ Messages socket connected');
                joinChat();
                messagesSocket.off('connect', connectHandler);
            };
            messagesSocket.on('connect', connectHandler);
        }

        messagesSocket.on('reconnect', () => {
            console.log('🔄 Messages socket reconnected');
            joinChat();
        });

        messagesSocket.on('connect_error', (error: Error) => {
            console.error('Messages socket connection error:', error);
        });

        return () => {
            messagesSocket.off('message:new', handleNewMessage);
            messagesSocket.offAny(onAnyHandler);
            if (chatId) {
                messagesSocket.emit('chat:leave', { chatId });
            }
        };
    }, [chatId, userId, queryClient, messagesEndRef]);
};

