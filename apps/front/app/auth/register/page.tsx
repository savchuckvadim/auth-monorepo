'use client';
import { RegistrationForm } from "@/modules/processes/auth";
import { Card, CardHeader } from "@workspace/ui/components/card";
import { CardTitle } from "@workspace/ui/components/card";
import { CardDescription } from "@workspace/ui/components/card";
import { CardContent } from "@workspace/ui/components/card";


export default function Page() {
    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-center">Вход в систему</CardTitle>
                <CardDescription className="text-center">
                    Зарегистрируйтесь в системе
                </CardDescription>
            </CardHeader>
            <CardContent>
                <RegistrationForm />
            </CardContent>
        </Card>
    );
}
