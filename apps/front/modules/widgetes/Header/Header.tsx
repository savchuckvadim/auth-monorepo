'use client'
import { APP_TITLE } from "@/modules/app";
import { CurrentUser } from "@/modules/entities/user";
import { Logout } from "@/modules/processes/"
import { Button } from "@workspace/ui/components/button";
import { Home, MessageCircle, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";


export const Header = () => {

    const pathname = usePathname();
    return (
        <nav className="absolute top-0 left-0 right-0 z-50 bg-background/20 border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center  gap-8">
                        <h1 className="text-2xl font-bold text-foreground">
                            {APP_TITLE}
                        </h1>


                        <div className="flex items-center gap-2">
                            <Link className="text-sm text-primary" href="/network">
                                <Button
                                    variant={pathname === '/network/profile' ? 'default' : 'ghost'}
                                    size="sm"
                                >
                                    <Home className="h-4 w-4 mr-2" />
                                    Главная
                                </Button>
                            </Link>
                            <Link href="/network/chats">
                                <Button
                                    variant={pathname === '/network/chats' ? 'default' : 'ghost'}
                                    size="sm"
                                >
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    Диалоги
                                </Button>
                            </Link>
                            <Link href="/network/users">
                                <Button
                                    variant={pathname === '/network/users' ? 'default' : 'ghost'}
                                    size="sm"
                                >
                                    <Users className="h-4 w-4 mr-2" />
                                    Пользователи
                                </Button>
                            </Link>
                        </div>

                    </div>

                    <div className="flex items-center gap-4">
                        <CurrentUser />
                        <Logout />
                    </div>
                </div>
            </div>
        </nav>

    )
}
