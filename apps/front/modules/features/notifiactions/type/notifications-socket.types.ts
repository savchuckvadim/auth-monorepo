/** Payload for `notification:new-message` on the notifications namespace socket. */
export type NotificationNewMessagePayload = {
    type?: string;
    message: {
        id: string;
        chatId: string;
        content: string;
        sender: { name: string };
    };
    timestamp?: string;
};
