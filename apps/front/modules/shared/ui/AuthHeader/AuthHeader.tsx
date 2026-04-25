'use client';

import { APP_TITLE } from '@/modules/app';
import { ThemeToggle } from '../ThemeToggle';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Шапка для страниц auth: логотип + название, переключение темы (без профиля / выхода).
 */
export function AuthHeader() {
    return (
        <header className="relative z-20 w-full shrink-0 border-b border-border/60 bg-card backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
                <Link
                    href="/"
                    className="flex items-center gap-2.5 rounded-md outline-none ring-offset-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <Image
                        src="/logo.svg"
                        alt=""
                        width={36}
                        height={36}
                        priority
                    />
                    <span className="text-lg font-bold tracking-tight text-foreground">
                        {APP_TITLE}
                    </span>
                </Link>
                <ThemeToggle />
            </div>
        </header>
    );
}
