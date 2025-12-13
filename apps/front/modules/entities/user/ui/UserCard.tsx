import { UserDto } from "@workspace/nest-api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";

export const UserCard = ({ user }: { user: UserDto }) => {
    return (
        <Card className="w-full h-[50vh] bg-background/40">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
                <CardDescription className="text-sm text-gray-500">{user.email}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-500">{user.email}</p>
            </CardContent>

        </Card>
    )
}
