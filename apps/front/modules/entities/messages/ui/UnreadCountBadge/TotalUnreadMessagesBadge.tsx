'use client';

import { useTotalUnreadMessages } from '../../lib/hooks/useMessages';
import { UnreadCountBadge, type UnreadCountBadgeProps } from './UnreadCountBadge';

type Props = Omit<UnreadCountBadgeProps, 'count'> & {
    /** Override count (e.g. tests); default: hook from API */
    count?: number;
};

/**
 * Total unread across all chats (GET /messages/unread/total). Use in nav / headers.
 */
export function TotalUnreadMessagesBadge(props: Props) {
    const { count: countProp, ...rest } = props;
    const { data } = useTotalUnreadMessages();
    const count = countProp ?? data ?? 0;

    return <UnreadCountBadge count={count} {...rest} />;
}
