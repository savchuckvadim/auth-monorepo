'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Users } from 'lucide-react';
import { UserWithFollowStatusDto } from '@workspace/nest-api';

interface CreateChatDialogWidgetProps {
    isOpen: boolean;
    currentUserId: string;
    allUsers: UserWithFollowStatusDto[] | undefined;
    selectedUserIds: string[];
    onUserToggle: (userId: string) => void;
    onCreateChat: () => void;
    onCancel: () => void;
    isPending: boolean;
}

export const CreateChatDialogWidget = ({
    isOpen,
    currentUserId,
    allUsers,
    selectedUserIds,
    onUserToggle,
    onCreateChat,
    onCancel,
    isPending,
}: CreateChatDialogWidgetProps) => {
    if (!isOpen) return null;

    return (
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
                        {allUsers
                            ?.filter((u) => u.id !== currentUserId)
                            .map((user: UserWithFollowStatusDto) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between p-2 hover:bg-accent rounded cursor-pointer"
                                    onClick={() => onUserToggle(user.id)}
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
                            onClick={onCancel}
                            className="flex-1"
                        >
                            Отмена
                        </Button>
                        <Button
                            onClick={onCreateChat}
                            disabled={selectedUserIds.length === 0 || isPending}
                            className="flex-1"
                        >
                            Создать
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

