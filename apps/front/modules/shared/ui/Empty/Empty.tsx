import { cn } from "@workspace/ui/lib/utils";
import { useTheme } from "next-themes";
import Image from "next/image"



export const Empty = ({ text }: { text?: string }) => {
    const { theme } = useTheme();

    const isDarkMode = theme?.includes('dark');


    return (
        <div className='flex flex-col items-center justify-center h-full p-4 '>

            {!text && <Image
                src='/empty.svg'
                alt='Empty'
                width={300}
                height={300}
                className={cn( isDarkMode && "bg-gray-200 p-10  ")}
                priority
            />}
            {text && <Image
                src='/EmptyWithoutText.svg'
                alt='Empty'
                width={300}
                height={300}
                className={cn( isDarkMode && "bg-foreground")}
                priority
            />}
            {text && <p className='text-muted-foreground text-center'>{text}</p>}
        </div>
    )
}
