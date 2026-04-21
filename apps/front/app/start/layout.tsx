import { LoadingScreen } from "@/modules/shared/ui";
// import "@/styles/globals.css";
import { Metadata } from "next";
import Image from "next/image";


export const metadata: Metadata = {
    title: "Sociopath authentication",
    description: "Sociopath authentication",
};

export default function StartLayout({
    children,
    // params,
}: {
    children: React.ReactNode;
    // params: Promise<{ slug: string[] }>;
}) {
    // const param = await params
    // const isAuthSubPage = pathname.split('/auth/')[1]?.length > 0;
    // console.log(isAuthSubPage)
    // console.log(param)
    return (
        <div className={`relative h-screen w-screen  flex items-center justify-center bg-mainBackground`}>
            {/* Фоновая картинка */}
            <Image
                className="absolute inset-0 z-0 object-contain opacity-10"
                src="/logo.svg"
                alt="Logo"
                fill
            />
            <LoadingScreen />

            <div className="relative w-full">
                {children}
            </div>
        </div>
    );
}

