'use client';

import { Card, CardHeader } from "@workspace/ui/components/card";
import { CardTitle } from "@workspace/ui/components/card";
import { CardDescription } from "@workspace/ui/components/card";
import { CardContent } from "@workspace/ui/components/card";
import dynamic from "next/dynamic";

const DynamicRegistrationForm = dynamic(() => import('@/modules/processes/auth/ui/RegistredForm/RegistredForm')
    .then(mod => mod.RegistrationForm), {
    ssr: false,
});

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
                <DynamicRegistrationForm />
            </CardContent>
        </Card>
    );
}
