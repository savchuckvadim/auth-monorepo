'use client';

import { Badge } from "@workspace/ui/components/badge";
import Orb from "@workspace/ui/components/Orb";
import { Users } from "lucide-react";


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>

        
            <div className="min-h-screen bg-background/90">
                {/* Video Background */}

                <nav className="bg-background/90 border-b shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-8">
                                <h1 className="text-2xl font-bold text-foreground">
                                    IT Booster Auth
                                </h1>

                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant="outline" className="text-primary border-primary">
                                    <Users className="w-4 h-4 mr-2" />
                                    Для пользователей
                                </Badge>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="max-w-4xl mx-auto p-6">

                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-bold text-foreground mb-4">
                            Аутентификация и Регистрация
                        </h1>

                    </div>

                    {children}


                </div>
            </div>
        </>


    );
}
