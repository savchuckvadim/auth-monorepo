import { EIconColor, MessageIcon, PeopleIcon, ProfileIcon } from "@/modules/shared";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";


export enum ENavigationType {
    ME = 'me',
    MESSAGE = 'chats',
    PEOPLE = 'people',

}
interface NavItemProps {
    label: string;
    href: string;
    isActive: boolean;
    type: ENavigationType;
}
export const NavItem = ({ label, href, type, isActive }: NavItemProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const { theme } = useTheme()
    const iconColor = (isHovered || isActive)
        ? EIconColor.RED
        : theme?.includes('dark')
            ? EIconColor.LIGHT
            : EIconColor.DARK;

    return (
        <Link
            key={href}
            href={href}
            className="w-full "
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                cursor: 'pointer'
            }}
        >
            <Button
                variant={'ghost'}
                className={cn(
                    'h-11 md:h-11',
                    "w-full md:w-full justify-center md:justify-start",
                    "flex-1 md:flex-none",
                    isActive
                        ? 'bg-card text-primary'
                        : 'text-foreground',
                    "hover:bg-card hover:text-primary"
                )}>
                <span className="flex items-center gap-2">
                    {
                        type === ENavigationType.PEOPLE
                            ? <PeopleIcon color={iconColor}/>
                            : type === ENavigationType.MESSAGE
                                ? <MessageIcon color={iconColor} size={25} />
                                : <ProfileIcon color={iconColor} size={25} />
                    }
                    <span className="hidden md:inline">{label}</span>
                </span>
            </Button>
        </Link>
    )
}
