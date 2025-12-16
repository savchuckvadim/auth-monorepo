'use client'
import { APP_TITLE } from "@/modules/app";
import { CurrentUser } from "@/modules/entities/user";
import { Logout } from "@/modules/processes/"


export const Header = () => {


    return (
        <nav className="absolute top-0 left-0 right-0 z-50 bg-background/20 border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center  gap-8">
                        <h1 className="text-2xl font-bold text-foreground">
                            {APP_TITLE}
                        </h1>


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
