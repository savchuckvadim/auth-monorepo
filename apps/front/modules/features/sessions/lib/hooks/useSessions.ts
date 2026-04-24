'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SessionsService } from '../api/SessionsService';

const SESSIONS_QUERY_KEY = ['auth', 'sessions'] as const;

const sessionsService = new SessionsService();

/**
 * Список активных сессий + мутации ревокации.
 *
 * Стратегия инвалидации:
 *  - `revoke(sessionId)` — ревокуем чужую сессию → инвалидируем `['auth', 'sessions']`.
 *  - `revokeAll()` — ревокуем всё, включая текущую. Бэк после этого уже
 *    стёр cookies, значит следующий запрос получит 401 и сработает
 *    обычный redirect на `/auth/login` через `AuthSessionListener`.
 *    Инвалидацию делаем «на всякий», но UI обычно не успевает её увидеть.
 */
export function useSessions() {
    const queryClient = useQueryClient();

    const sessionsQuery = useQuery({
        queryKey: SESSIONS_QUERY_KEY,
        queryFn: () => sessionsService.listSessions(),
    });

    const revokeSessionMutation = useMutation({
        mutationKey: ['auth', 'sessions', 'revoke'],
        mutationFn: (sessionId: string) => sessionsService.revokeSession(sessionId),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: SESSIONS_QUERY_KEY });
        },
    });

    const revokeAllSessionsMutation = useMutation({
        mutationKey: ['auth', 'sessions', 'revoke-all'],
        mutationFn: () => sessionsService.revokeAllSessions(),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: SESSIONS_QUERY_KEY });
        },
    });

    return {
        sessions: sessionsQuery.data ?? [],
        isLoading: sessionsQuery.isLoading,
        isFetching: sessionsQuery.isFetching,
        error: sessionsQuery.error,
        refetch: sessionsQuery.refetch,

        revokeSession: revokeSessionMutation.mutate,
        revokeSessionAsync: revokeSessionMutation.mutateAsync,
        isRevokingSession: revokeSessionMutation.isPending,
        pendingRevokeId: revokeSessionMutation.variables ?? null,

        revokeAllSessions: revokeAllSessionsMutation.mutate,
        revokeAllSessionsAsync: revokeAllSessionsMutation.mutateAsync,
        isRevokingAll: revokeAllSessionsMutation.isPending,
    };
}
