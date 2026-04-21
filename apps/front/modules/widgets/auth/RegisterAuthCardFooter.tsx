import Link from 'next/link';

import {
    AuthCardFooter,
    AuthCardFooterSeparator,
} from '@/modules/shared/ui/AuthCardFooter';

type RegisterAuthCardFooterProps = {
    termsHref?: string;
    privacyHref?: string;
    signInHref?: string;
};

export function RegisterAuthCardFooter({
    termsHref = '/terms',
    privacyHref = '/privacy',
    signInHref = '/auth/login',
}: RegisterAuthCardFooterProps) {
    return (
        <AuthCardFooter>
            <p className="text-center text-xs leading-relaxed text-muted-foreground">
                By pressing Sign Up, you agree to the{' '}
                <Link
                    href={termsHref}
                    className="underline underline-offset-2 hover:text-foreground"
                >
                    Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                    href={privacyHref}
                    className="underline underline-offset-2 hover:text-foreground"
                >
                    Privacy Policy
                </Link>
                .
            </p>
            <AuthCardFooterSeparator />
            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                    href={signInHref}
                    className="font-medium text-primary hover:underline"
                >
                    Sign In
                </Link>
            </p>
        </AuthCardFooter>
    );
}
