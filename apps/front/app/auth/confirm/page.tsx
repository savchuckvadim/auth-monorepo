'use client';

import { Card, CardHeader } from "@workspace/ui/components/card";
import { CardTitle } from "@workspace/ui/components/card";
import { CardDescription } from "@workspace/ui/components/card";
import { CardContent } from "@workspace/ui/components/card";

export default function Page() {
    return (
        <div className="flex w-full flex-row justify-center items-start pt-30">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-center">Активируйте аккаунт</CardTitle>
                    <CardDescription className="text-center">
                        Ссылка для активации отправлена на вашу электронную почту
                    </CardDescription>
                </CardHeader>
                <CardContent>
                </CardContent>
            </Card>
        </div>
    );
}
