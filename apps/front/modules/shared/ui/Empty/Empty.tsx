import { cn } from "@workspace/ui/lib/utils";
import { useTheme } from "next-themes";
import Image from "next/image"
import { EmptyIcon } from "../icons";



export const Empty = ({ text }: { text?: string }) => {
    const { theme } = useTheme();

    const isDarkMode = theme?.includes('dark');


    return (
        <div className='flex flex-col items-center justify-center h-full p-4 '>

            <EmptyIcon />

            {text && <p className='text-muted-foreground text-center'>{text}</p>}
        </div>
    )
}
