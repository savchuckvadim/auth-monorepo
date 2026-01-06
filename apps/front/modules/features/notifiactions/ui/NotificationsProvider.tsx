import { useAppSelector } from "@/modules/app";
import { useNotificationsSocket } from "../lib/hook/notifications-socket.hook";
import { NotificationToast } from "./NotificationToast";

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {

    const notifications = useAppSelector((state) => state.notification.notifications);

    return (
        <>
            {notifications.map((notification, index) => (
                <NotificationToast
                    key={`${notification.id}-${notification.type}`}
                    notification={notification}
                    index={index}
                />
            ))}
            {children}
        </>
    );
};
