'use client';



import { useState, useEffect, useRef, useMemo } from 'react';
import { useUserChats, useCreateChat, useMarkChatAsRead } from '@/modules/entities/chats/lib/hooks/useChats';
import { useChatMessages, useCreateMessage } from '@/modules/entities/messages/lib/hooks/useMessages';
import { useAllUsers } from '@/modules/entities/followers/lib/hooks/useFollowers';
import { Chat, ChatType, CreateChat} from '@/modules/entities/chats/lib/types/chats.types';
import { Message, MessageType } from '@/modules/entities/messages/lib/types/messages.types';
import { UserWithFollowStatus } from '@/modules/entities/followers/lib/types/followers.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { MessageCircle, Send, Plus, Search, Users, Lock } from 'lucide-react';
import { useAuth } from '@/modules/processes';
import { LoadingScreen } from '@/modules/shared/ui';
// import { connectNotificationsSocket, disconnectNotificationsSocket, getNotificationsSocket } from '@/modules/shared';
import { connectMessagesSocket } from '@/modules/shared/lib/socket/messages-socket';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ChatMemberDto, CreateChatDto } from '@workspace/nest-api';


export default function ChatsPage() {
    const { currentUser } = useAuth();
    const router = useRouter();
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [messageText, setMessageText] = useState('');
    const [showNewChatDialog, setShowNewChatDialog] = useState(false);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const queryClient = useQueryClient();
    const { data: chats, isLoading: chatsLoading } = useUserChats();
    const { data: messages, isLoading: messagesLoading } = useChatMessages(
        selectedChatId || '',
        50,
        0
    );
    const { data: allUsers } = useAllUsers();
    const createChatMutation = useCreateChat();
    const createMessageMutation = useCreateMessage();
    const markChatReadMutation = useMarkChatAsRead();
    // const markMessagesReadMutation = useMarkMessagesRead();

    // Сообщения уже приходят в порядке возрастания (старые -> новые),
    // поэтому просто используем их как есть - последние будут внизу
    const sortedMessages = useMemo(() => {
        return messages ? (messages as unknown as Message[]) : [];
    }, [messages]);
    // Логирование для отладки
    useEffect(() => {
        if (selectedChatId && sortedMessages.length > 0) {
            console.log('📋 Messages in chat:', sortedMessages.length, 'messages');
            console.log('📋 Last message:', sortedMessages[sortedMessages.length - 1]);
        }
    }, [sortedMessages, selectedChatId]);

    // Инициализируем WebSocket для сообщений
    useEffect(() => {
        if (!currentUser?.id || !selectedChatId) return;

        // Подключаемся к WebSocket для сообщений
        // userId передается в query, cookies (httpOnly) отправятся автоматически с withCredentials: true
        const messagesSocket = connectMessagesSocket(currentUser.id);

        // Обработчик новых сообщений (регистрируем ДО подключения, чтобы не пропустить события)
        const handleNewMessage = (newMessage: Message) => {
            console.log('📨 New message received via WebSocket:', newMessage);
            console.log('📨 Current chatId:', selectedChatId);
            console.log('📨 Message chatId:', newMessage.chatId);

            // Если это сообщение для текущего чата, обновляем кэш оптимистично
            if (newMessage.chatId === selectedChatId) {
                console.log('✅ Message is for current chat, updating cache');
                // Оптимистично добавляем сообщение в кэш
                queryClient.setQueryData(
                    ['messages', 'chat', selectedChatId, 50, 0],
                    (oldData: Message[] | undefined) => {
                        console.log('📝 Old data:', oldData?.length, 'messages');
                        if (!oldData) {
                            console.log('📝 No old data, returning new message');
                            return [newMessage];
                        }
                        // Проверяем, нет ли уже такого сообщения
                        const exists = oldData.some((msg: Message) => msg.id === newMessage.id);
                        if (exists) {
                            console.log('⚠️ Message already exists in cache');
                            return oldData;
                        }
                        // Удаляем временные сообщения с таким же контентом
                        const filtered = oldData.filter((msg: Message) =>
                            !(msg.id?.startsWith('temp-') && msg.content === newMessage.content && msg.senderId === newMessage.senderId)
                        );
                        console.log('📝 Adding new message to cache, total:', filtered.length + 1);
                        // Добавляем новое сообщение в конец (последние внизу)
                        return [...filtered, newMessage];
                    }
                );

                // Обновляем список чатов
                queryClient.invalidateQueries({ queryKey: ['chats', 'user'] });

                // Автопрокрутка к новому сообщению
                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            } else {
                console.log('ℹ️ Message is for different chat, updating chat list only');
                // Если это сообщение для другого чата, просто обновляем список чатов
                queryClient.invalidateQueries({ queryKey: ['chats', 'user'] });
            }
        };

        // Регистрируем обработчик ДО подключения, чтобы не пропустить события
        messagesSocket.on('message:new', handleNewMessage);

        // Дополнительное логирование всех событий для отладки
        const onAnyHandler = (event: string, ...args: unknown[]) => {
            console.log('🔔 WebSocket event received:', event, args);
            if (event === 'message:new') {
                console.log('📨 message:new event detected!', args[0]);
            }
        };
        messagesSocket.onAny(onAnyHandler);

        // Логирование подключения к комнате
        messagesSocket.on('chat:joined', (data: { chatId?: string;[key: string]: unknown }) => {
            console.log('✅ Joined chat room:', data);
        });

        // При подключении бэкенд автоматически добавляет клиента во все чаты
        // Но мы все равно вызываем chat:join для явного подтверждения
        const joinChat = () => {
            console.log('📤 Joining chat:', selectedChatId);
            messagesSocket.emit('chat:join', { chatId: selectedChatId }, (response: { error?: string;[key: string]: unknown } | null) => {
                if (response?.error) {
                    console.error('❌ Chat join error:', response.error);
                } else {
                    console.log('✅ Chat join success:', response);
                }
            });
        };

        // Если уже подключен, сразу присоединяемся к чату
        if (messagesSocket.connected) {
            console.log('✅ Messages socket already connected');
            joinChat();
        } else {
            // Ждем подключения перед отправкой событий
            const connectHandler = () => {
                console.log('✅ Messages socket connected');
                joinChat();
                messagesSocket.off('connect', connectHandler);
            };
            messagesSocket.on('connect', connectHandler);
        }

        // Обрабатываем переподключение
        messagesSocket.on('reconnect', () => {
            console.log('🔄 Messages socket reconnected');
            joinChat();
        });

        // Обработка ошибок
        messagesSocket.on('connect_error', (error: Error) => {
            console.error('Messages socket connection error:', error);
        });

        return () => {
            messagesSocket.off('message:new', handleNewMessage);
            messagesSocket.offAny(onAnyHandler);
            if (selectedChatId) {
                messagesSocket.emit('chat:leave', { chatId: selectedChatId });
            }
        };
    }, [selectedChatId, currentUser?.id, queryClient]);

    useEffect(() => {
        if (selectedChatId) {
            markChatReadMutation.mutate(selectedChatId);
        }
    }, [selectedChatId, markChatReadMutation]);

    useEffect(() => {
        // Автопрокрутка к последнему сообщению
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, selectedChatId]);

    // Автопрокрутка при отправке нового сообщения
    useEffect(() => {
        if (createMessageMutation.isSuccess && messagesEndRef.current) {
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [createMessageMutation.isSuccess]);

    if (!currentUser) {
        return <LoadingScreen />;
    }

    const handleSendMessage = async () => {
        if (!selectedChatId || !messageText.trim()) return;

        const content = messageText.trim();
        setMessageText(''); // Очищаем поле сразу для лучшего UX

        // Создаем временное сообщение для оптимистичного обновления
        const tempMessage: Message = {
            id: `temp-${Date.now()}`,
            chatId: selectedChatId,
            senderId: currentUser.id,
            content,
            type: MessageType.TEXT,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            sender: {
                id: currentUser.id,
                name: currentUser.name || '',
                email: currentUser.email || '',
            },
        };

        // Оптимистично добавляем сообщение в UI
        queryClient.setQueryData(
            ['messages', 'chat', selectedChatId, 50, 0],
            (oldData: Message[] | undefined) => {
                if (!oldData) return [tempMessage];
                return [...oldData, tempMessage];
            }
        );

        // Автопрокрутка
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 50);

        try {
            // Отправляем через REST API (WebSocket обработает на бэкенде)
            const sentMessage = await createMessageMutation.mutateAsync({
                chatId: selectedChatId,
                content,
            });

            console.log('✅ Message sent via REST API:', sentMessage);

            // customAxios уже извлекает data, так что sentMessage - это объект сообщения
            const messageData = sentMessage as Message;
            console.log('📝 Message data to add to cache:', messageData);

            // Заменяем временное сообщение на реальное
            queryClient.setQueryData(
                ['messages', 'chat', selectedChatId, 50, 0],
                (oldData: Message[] | undefined) => {
                    console.log('📝 Updating cache, old data length:', oldData?.length);
                    if (!oldData) {
                        console.log('📝 No old data, returning new message');
                        return [messageData];
                    }
                    // Удаляем временное сообщение и добавляем реальное
                    const filtered = oldData.filter((msg: Message) => !msg.id?.startsWith('temp-'));
                    console.log('📝 After filtering temp messages, length:', filtered.length);
                    // Проверяем, нет ли уже такого сообщения
                    const exists = filtered.some((msg: Message) => msg.id === messageData.id);
                    if (exists) {
                        console.log('⚠️ Message already exists in cache');
                        return filtered;
                    }
                    const newData = [...filtered, messageData];
                    console.log('✅ New cache data length:', newData.length);
                    return newData;
                }
            );

            // Обновляем список чатов
            queryClient.invalidateQueries({ queryKey: ['chats', 'user'] });

            // Автопрокрутка после обновления
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (error) {
            console.error('Failed to send message:', error);
            // Удаляем временное сообщение при ошибке
            queryClient.setQueryData(
                ['messages', 'chat', selectedChatId, 50, 0],
                (oldData: Message[] | undefined) => {
                    if (!oldData) return [];
                    return oldData.filter((msg: Message) => !msg.id?.startsWith('temp-'));
                }
            );
            setMessageText(content); // Возвращаем текст при ошибке
        }
    };

    const handleCreateChat = async () => {
        if (selectedUserIds.length === 0) return;

        try {
            const chatData: CreateChat = {
                type: selectedUserIds.length === 1 ? ChatType.PRIVATE : ChatType.GROUP,
                memberIds: selectedUserIds,
                name: '',
                description: '',
            };
            const chat = await createChatMutation.mutateAsync(chatData as CreateChatDto);
            setSelectedChatId((chat as unknown as Chat).id);
            setShowNewChatDialog(false);
            setSelectedUserIds([]);
        } catch (error) {
            console.error('Failed to create chat:', error);
        }
    };

    const filteredChats = (chats as Chat[] | undefined)?.filter((chat) => {
        if (!searchQuery) return true;
        const searchLower = searchQuery.toLowerCase();
        return (
            chat.name?.toLowerCase().includes(searchLower) ||
            chat.members?.some((m: ChatMemberDto) =>
                m.user?.name.toLowerCase().includes(searchLower) ||
                m.user?.email.toLowerCase().includes(searchLower)
            )
        );
    }) || [];

    const selectedChat = (chats as Chat[] | undefined)?.find((c) => c.id === selectedChatId);

    return (
        <div className="h-screen bg-background flex overflow-hidden">
            {/* Список чатов */}
            <div className="w-80 border-r bg-card flex flex-col h-full">
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Диалоги</h2>
                        <Button
                            size="sm"
                            onClick={() => setShowNewChatDialog(true)}
                            variant="outline"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="Поиск..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {chatsLoading ? (
                        <div className="p-4 text-center text-muted-foreground">
                            Загрузка...
                        </div>
                    ) : filteredChats.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                            Нет диалогов
                        </div>
                    ) : (
                        <div className="p-2">
                            {filteredChats.map((chat: Chat) => {
                                const otherMembers = chat.members?.filter(
                                    (m: ChatMemberDto) => m.userId !== currentUser.id
                                ) || [];
                                const chatName =
                                    chat.type === ChatType.PRIVATE
                                        ? otherMembers[0]?.user?.name || 'Пользователь'
                                        : chat.name || 'Групповой чат';

                                return (
                                    <Card
                                        key={chat.id}
                                        className={`mb-2 cursor-pointer hover:bg-accent transition-colors ${selectedChatId === chat.id ? 'bg-accent' : ''
                                            }`}
                                        onClick={() => setSelectedChatId(chat.id)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <MessageCircle className="h-5 w-5 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate">{chatName}</p>
                                                    {chat.lastMessage && (
                                                        <p className="text-sm text-muted-foreground truncate">
                                                            {chat.lastMessage.content}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {chat.type === ChatType.PRIVATE && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                router.push(`/network/secret-chat/${chat.id}`);
                                                            }}
                                                            title="Секретный чат"
                                                        >
                                                            <Lock className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {chat.unreadCount && chat.unreadCount > 0 && (
                                                        <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                            {chat.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Область сообщений */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {selectedChatId ? (
                    <>
                        {/* Заголовок чата */}
                        <div className="border-b p-4 bg-card flex-shrink-0">
                            <h3 className="font-semibold">
                                {selectedChat?.type === ChatType.PRIVATE
                                    ? selectedChat.members
                                        ?.find((m: ChatMemberDto) => m.userId !== currentUser.id)
                                        ?.user?.name || 'Пользователь'
                                    : selectedChat?.name || 'Групповой чат'}
                            </h3>
                            {selectedChat?.type === ChatType.GROUP && (
                                <p className="text-sm text-muted-foreground">
                                    {selectedChat.members?.length} участников
                                </p>
                            )}
                        </div>

                        {/* Сообщения */}
                        <div className="flex-1 overflow-y-auto p-4 min-h-0">
                            {messagesLoading ? (
                                <div className="h-full flex items-center justify-center">
                                    <div className="text-center text-muted-foreground">
                                        Загрузка сообщений...
                                    </div>
                                </div>
                            ) : sortedMessages && sortedMessages.length > 0 ? (
                                <div className="space-y-4 flex flex-col">
                                    {sortedMessages.map((message: Message) => {
                                        const isOwn = message.senderId === currentUser.id;
                                        return (
                                            <div
                                                key={message.id}
                                                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[70%] rounded-lg p-3 ${isOwn
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted'
                                                        }`}
                                                >
                                                    {!isOwn && (
                                                        <p className="text-xs font-medium mb-1 opacity-70">
                                                            {message.sender?.name || 'Пользователь'}
                                                        </p>
                                                    )}
                                                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                                                    <p className="text-xs opacity-70 mt-1">
                                                        {new Date(message.createdAt).toLocaleTimeString('ru-RU', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} className="h-0" />
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center">
                                    <div className="text-center text-muted-foreground">
                                        Нет сообщений. Начните диалог!
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Поле ввода - зафиксировано внизу */}
                        <div className="border-t p-4 bg-card flex-shrink-0">
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="Введите сообщение..."
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    className="flex-1"
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!messageText.trim() || createMessageMutation.isPending}
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center h-full">
                        <div className="text-center">
                            <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">
                                Выберите диалог или создайте новый
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Диалог создания нового чата */}
            {showNewChatDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>Создать диалог</CardTitle>
                            <CardDescription>
                                Выберите пользователей для создания чата
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 mb-4 overflow-y-auto">
                                {(allUsers as UserWithFollowStatus[] | undefined)
                                    ?.filter((u) => u.id !== currentUser.id)
                                    .map((user: UserWithFollowStatus) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center justify-between p-2 hover:bg-accent rounded cursor-pointer"
                                            onClick={() => {
                                                setSelectedUserIds((prev) =>
                                                    prev.includes(user.id)
                                                        ? prev.filter((id) => id !== user.id)
                                                        : [...prev, user.id]
                                                );
                                            }}
                                        >
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                            {selectedUserIds.includes(user.id) && (
                                                <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                                    <Users className="h-3 w-3 text-primary-foreground" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowNewChatDialog(false);
                                        setSelectedUserIds([]);
                                    }}
                                    className="flex-1"
                                >
                                    Отмена
                                </Button>
                                <Button
                                    onClick={handleCreateChat}
                                    disabled={
                                        selectedUserIds.length === 0 || createChatMutation.isPending
                                    }
                                    className="flex-1"
                                >
                                    Создать
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

