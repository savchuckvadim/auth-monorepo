'use client';

import { Button } from "@workspace/ui/components/button";
import { Loader2, LogOut } from "lucide-react";
import { useAuth } from "../../lib/hooks/auth.hook";
import { AppTooltip } from "@/modules/shared";


export const Logout = () => {
    const { logout, isLoading } = useAuth();
    return (
        <div className="cursor-pointer">
            <AppTooltip content="Выйти из аккаунта">
                <Button variant="outline" onClick={logout} disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}

                </Button>
            </AppTooltip>
        </div>
    )
}
