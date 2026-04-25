'use client';

import { Button } from '@workspace/ui/components/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getCurrentYear } from '@/modules/shared/lib';

export default function Page() {
    const router = useRouter();
    return (
        <div className="relative h-screen w-screen flex items-center justify-center bg-brand-dark text-brand-light">
            <Image
                className="absolute inset-0 z-0 object-contain opacity-10"
                src="/grey-logo.svg"
                alt="Logo"
                fill
            />

            <div className="relative z-10 flex w-full flex-row justify-center items-center h-screen">
                <div className="flex w-xl flex-col justify-between gap-3 h-screen p-3">
                    <div className="flex flex-row items-center justify-center gap-3 pt-5">
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            width={70}
                            height={70}
                        />
                        <h1 className="text-5xl font-bold text-brand-light">Sociopath.</h1>
                    </div>
                    <div className="mb-10">
                        <div className="flex flex-col justify-start items-center gap-3 h-32 mb-10 p-3">
                            <h2 className="text-2xl sm:text-5xl font-bold text-brand-light">
                                Become a Sociopath.
                            </h2>
                            <p className="text-2xl font-light text-brand-light">
                                and give a shit at all
                            </p>
                        </div>
                        <div className="min-w-full flex flex-row flex-wrap justify-center items-center gap-3">
                            <Button
                                onClick={() => router.push('/auth/login')}
                                className="w-3/4 sm:w-[48%] h-[55px]"
                                variant="default"
                                size="lg"
                            >
                                Login
                            </Button>
                            <Button
                                onClick={() => router.push('/auth/register')}
                                className="w-3/4 sm:w-[48%] h-[55px] text-brand-dark bg-brand-light"
                                variant="outline"
                                size="lg"
                            >
                                Sign up
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-row justify-center items-center gap-3 w-full">
                        <p className="text-xs text-brand-light/70">
                            © {getCurrentYear()} Sociopath. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
