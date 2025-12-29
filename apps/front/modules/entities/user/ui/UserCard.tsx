import { UserDto } from "@workspace/nest-api";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import Link from "next/link";
import { useCheckFollowing, useFollow, useMyFriends, useUnfollow } from "../../followers";
import { Preloader } from "@/modules/shared";


export const UserCard = ({ user }: { user: UserDto }) => {


    const { mutate: follow, isPending: isFollowing } = useFollow();
    const { mutate: unfollow, isPending: isUnfollowing } = useUnfollow();


    const status = user.isFriend ? 'Друг' : user.isFollower ? 'Подписан' : '';

    return (
        <Card className="w-full bg-background/40">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
                {/* <CardDescription className="text-sm text-gray-500">{user.email}</CardDescription> */}
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <p className="text-sm text-gray-500 mb-2">{user.email}</p>
                <p className="text-xs text-gray-200 mb-2">{status}</p>
                {
                    user.isFollowing ? (
                        <Button onClick={() => unfollow(user.id || '')} disabled={isUnfollowing}> {isUnfollowing ? <Preloader /> : 'Отписаться'}</Button>
                    ) : (
                        <Button onClick={() => follow(user.id || '')} disabled={isFollowing}> {isFollowing ? <Preloader /> : 'Подписаться'}</Button>
                    )
                }
            </CardContent>

        </Card>
    )
}
