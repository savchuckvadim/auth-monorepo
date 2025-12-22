'use client';
import { Card, CardHeader } from "@workspace/ui/components/card";
import { CardTitle } from "@workspace/ui/components/card";
import { CardDescription } from "@workspace/ui/components/card";
import { CardContent } from "@workspace/ui/components/card";
import dynamic from "next/dynamic";
import Link from "next/link";

const DynamicLoginForm = dynamic(() => import('@/modules/processes/auth/ui/LoginForm/LoginForm')
    .then(mod => mod.LoginForm), {
    ssr: false,
});

export default function Page() {
    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-center">Вход в систему</CardTitle>
                <CardDescription className="text-center">
                    Войдите в свой аккаунт
                </CardDescription>
            </CardHeader>
            <CardContent>

                <DynamicLoginForm />
                <div className="text-right mt-4 flex items-center justify-between">
                    <p className="text-sm text-gray-500">Нет аккаунта?</p>
                    <Link href="/auth/register" className="text-sm text-blue-500 hover:text-blue-700 ml-2">
                        Зарегистрироваться
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
