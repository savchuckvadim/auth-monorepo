import { Card, CardHeader } from "@workspace/ui/components/card";
import { CardTitle } from "@workspace/ui/components/card";
import { CardDescription } from "@workspace/ui/components/card";
import { CardContent } from "@workspace/ui/components/card";
import { Metadata } from 'next';
import RegistrationFormWrapper from './RegistrationFormWrapper';

export const metadata: Metadata = {
    title: 'Регистрация — Sociopath Network',
    description: 'Зарегистрируйтесь в приватном сообществе для общения и поиска единомышленников',
    robots: {
        index: false,
        follow: false,
        noarchive: true,
        nosnippet: true,
    },
};

export default function Page() {
    return (
        <div className="flex w-full flex-row justify-center items-start pt-30">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-center">Вход в систему</CardTitle>
                    <CardDescription className="text-center">
                        Зарегистрируйтесь в системе
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RegistrationFormWrapper />
                </CardContent>
            </Card>
        </div>
    );
}
