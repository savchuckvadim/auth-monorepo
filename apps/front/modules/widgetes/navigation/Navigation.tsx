'use client'
import { usePathname } from "next/navigation"
import { ENavigationType, NavItem } from "./NavItem"


export const navigationItems = [{
    label: 'My Profile',
    href: '/network/profile',
    type: ENavigationType.PROFILE

},
{
    label: 'Chats',
    href: '/network/chats/list',
    type: ENavigationType.MESSAGE

},
{
    label: 'People',
    href: '/network/users',
    type: ENavigationType.PEOPLE
}
]
export const Navigation = () => {
    const pathname = usePathname();
    return (
        <div className='md:static fixed bottom-0 left-0 right-0 md:left-auto md:right-auto z-50 w-full md:w-auto flex flex-row md:flex-col items-center md:items-start gap-2 md:gap-4 px-2 md:px-0 py-2 md:py-0 bg-card md:bg-transparent border-t md:border-t-0 shadow-lg md:shadow-none'>
            {navigationItems.map((item) => (
                <NavItem
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    type={item.type}
                    isActive={pathname.includes(item.type)}
                />

            ))}
        </div>
    )
}
