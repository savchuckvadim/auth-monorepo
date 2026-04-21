'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getInvitations } from '@workspace/nest-api';
import { useRouter } from 'next/navigation';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Lock } from 'lucide-react';
import { getNetworkChatPath } from '@/modules/entities/chats';

const api = getInvitations();

export function IncomingInvitationsBanner() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: incoming, isLoading } = useQuery({
        queryKey: ['invitations', 'incoming'],
        queryFn: () => api.invitationsIncoming(),
        staleTime: 0,
        refetchOnWindowFocus: true,
        refetchInterval: 60_000,
    });

    const acceptMutation = useMutation({
        mutationFn: (id: string) => api.invitationsAccept(id),
        onSuccess: res => {
            void queryClient.invalidateQueries({ queryKey: ['invitations', 'incoming'] });
            void queryClient.invalidateQueries({ queryKey: ['chats', 'user'] });
            if (res.chat?.id) {
                router.push(getNetworkChatPath(res.chat.id));
            }
        },
    });

    const rejectMutation = useMutation({
        mutationFn: (id: string) => api.invitationsReject(id),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['invitations', 'incoming'] });
        },
    });

    if (isLoading || !incoming?.length) {
        return null;
    }

    return (
        <div className="px-2 pb-3 space-y-2">
            {incoming.map(inv => (
                <Card key={inv.id} className="border-amber-600/40 bg-amber-950/10">
                    <CardContent className="py-3 px-4 flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                            <Lock className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium">
                                    Защищённый чат (Signal)
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {inv.counterpartyName ?? 'Пользователь'} приглашает вас в E2EE-диалог
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={rejectMutation.isPending}
                                onClick={() => rejectMutation.mutate(inv.id)}
                            >
                                Отклонить
                            </Button>
                            <Button
                                size="sm"
                                disabled={acceptMutation.isPending}
                                onClick={() => acceptMutation.mutate(inv.id)}
                            >
                                Принять
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
