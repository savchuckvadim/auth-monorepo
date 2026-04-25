import { useNotificationsSocket } from "../lib/hook/notifications-socket.hook";

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
    useNotificationsSocket();

    return (
        <>
            {children}
        </>
    );
};
