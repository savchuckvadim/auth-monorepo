'use client';

import { MessageType } from '../../lib/types/messages.types';
import { SystemMessageNotice } from '../SystemMessageNotice/SystemMessageNotice';
import { CallEventNotice } from '../CallEventNotice';
import { RegularMessageItem } from './RegularMessageItem';
import type { MessageItemProps } from './MessageItem.types';

export const MessageItem = (props: MessageItemProps) => {
    if (props.message.type === MessageType.CALL_EVENT) {
        return (
            <CallEventNotice
                metadata={props.message.metadata}
                currentUserId={props.currentUserId}
                fallbackContent={props.message.content}
            />
        );
    }
    if (props.message.type === MessageType.SYSTEM) {
        return (
            <SystemMessageNotice content={props.message.content} />
        );
    }
    return <RegularMessageItem {...props} />;
};
