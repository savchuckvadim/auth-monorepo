'use client'
import { Logout, useAuth } from "@/modules/processes/"

export const Header = () => {
    const { currentUser } = useAuth();

    return (
        <nav className="absolute top-0 left-0 right-0 z-50 bg-background/20 border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center  gap-8">
                        <h1 className="text-2xl font-bold text-foreground">
                            IT Booster Auth Monorepo App
                        </h1>


                    </div>

                    <div className="flex items-center gap-4">
                      <p className="text-sm text-primary">{currentUser?.name}</p>
                        <Logout />
                    </div>
                </div>
            </div>
        </nav>

    )
}
