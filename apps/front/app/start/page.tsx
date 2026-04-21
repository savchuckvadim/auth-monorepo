"use client"

import { Button } from "@workspace/ui/components/button";
import Image from "next/image";
import { useRouter } from "next/navigation";


export default function Page() {
  const router = useRouter();
  return (
    <div className="flex w-full flex-row justify-center items-center h-screen">
      <div className="flex w-xl flex-col justify-between gap-3 h-screen p-3 ">
        <div className="flex flex-row items-center justify-center gap-3 pt-5">
          <Image
            className="text-foreground "
            src="/logo.svg"
            alt="Logo"
            width={70}
            height={70}
          />
          <h1 className="text-5xl font-bold text-foreground">Sociopath.</h1>
        </div>
        <div className="mb-10">
          <div className="flex flex-col justify-start items-center gap-3 h-32 mb-10 p-3">
            <h2 className="text-2xl sm:text-5xl font-bold text-foreground">Become a Sociopath.</h2>
            <p className="text-2xl font-light text-foreground">and give a shit at all</p>
          </div>
          <div className="min-w-full flex flex-row flex-wrap  justify-center items-center gap-3">
            <Button onClick={() => router.push('/auth/login')} className="w-3/4 sm:w-[48%] h-[55px]" variant='default' size='lg'>Login</Button>
            <Button onClick={() => router.push('/auth/register')} className="w-3/4 sm:w-[48%] h-[55px]" variant='outline' size='lg' >Sign up</Button>
          </div>
        </div>

        <div className="flex flex-row justify-center items-center gap-3 w-full">
          <p className="text-xs text-foreground">© 2025 Sociopath. All rights reserved.</p>
        </div>

      </div>
    </div>
  );
}

