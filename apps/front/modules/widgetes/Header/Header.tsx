'use client'
import { APP_TITLE } from "@/modules/app";
import { CurrentUser } from "@/modules/entities/user";
import { Logout } from "@/modules/processes/"
import { ThemeToggle } from "@/modules/shared";

import Image from "next/image";
import Link from "next/link";


export const Header = () => {


    return (
        <nav className="absolute top-0 left-0 right-0 z-50 bg-card ">
            <div className="container mx-auto px-4 sm:px-6 lg:px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center  gap-8">
                        <Link href="/network/profile">
                            <div className="flex items-center gap-2">
                                <Image src="/logo.svg" alt="logo" width={30} height={30} />
                                <h1 className="hidden md:block text-2xl font-bold text-foreground">
                                    {APP_TITLE}
                                </h1>
                            </div>
                        </Link>


                        {/* <div className="flex items-center gap-2">

                        </div> */}

                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <CurrentUser />
                        <Logout />
                    </div>
                </div>
            </div>
        </nav>

    )
}
