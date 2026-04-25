'use client';
import { AppTooltip } from "@/modules/shared";
import { Button } from "@workspace/ui/components/button";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export const SettingsButton = () => {
    const router = useRouter();
    return (
        <AppTooltip content="Settings">
            <Button variant="ghost" size="icon" onClick={() => router.push('/network/settings')} aria-label="Настройки">
                <Settings className="w-4 h-4" />
            </Button>
        </AppTooltip>
    );
};
