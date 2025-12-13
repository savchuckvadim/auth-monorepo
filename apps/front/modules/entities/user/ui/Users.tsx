'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { useUser } from "../lib/hook/user.hook";

export const Users = ({ userId }: { userId: string }) => {
    const { users } = useUser(userId);
    return (
        <div>

            {
                users?.map((user) => (
                    <div key={user.id}>
                        <Card>
                            <CardHeader>
                                <CardTitle>{user.name}</CardTitle>
                                <CardDescription>{user.email}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>{user.email}</p>
                            </CardContent>
                        </Card>
                    </div>
                ))
            }
        </div>
    )
}
