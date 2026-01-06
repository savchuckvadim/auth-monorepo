import { PostDto } from "@workspace/nest-api";
import { addNotification, INotification } from "../../../model/NotificationSlice";
import { EnumNotificationContentType, EnumNotificationType } from "../../../type/notification.consts";
import { AppDispatch } from "@/modules/app/model/store";

export const postCreatedHandler = (post: PostDto, dispatch: AppDispatch) => {
    const notification: INotification = {
        id: post.id,
        title: `Новый пост от ${post.author?.name}`,
        message: `Пользователь ${post.author?.name} опубликовал новый пост`,
        createdAt: new Date().toISOString(),
        type: EnumNotificationType.POST,
        contentType: EnumNotificationContentType.POST,
        url: `/people/${post.userId}`,
    };

    dispatch(addNotification(notification));
}
