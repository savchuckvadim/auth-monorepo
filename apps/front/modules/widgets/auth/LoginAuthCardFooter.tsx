import Link from 'next/link';

import {
    AuthCardFooter,
    AuthCardFooterSeparator,
} from '@/modules/shared/ui/AuthCardFooter';

type LoginAuthCardFooterProps = {
    forgotPasswordHref?: string;
    signUpHref?: string;
};

export function LoginAuthCardFooter({
    forgotPasswordHref = '/auth/forgot-password',
    signUpHref = '/auth/register',
}: LoginAuthCardFooterProps) {
    return (
        <AuthCardFooter>
            <div className="text-center">
                <Link
                    href={forgotPasswordHref}
                    className="text-sm font-medium text-primary hover:underline"
                >
                    Forgot password?
                </Link>
            </div>
            <AuthCardFooterSeparator />
            <p className="text-center text-sm text-muted-foreground">
                Don&apos;t you have an account yet?{' '}
                <Link
                    href={signUpHref}
                    className="font-medium text-primary hover:underline"
                >
                    Sign up
                </Link>
            </p>
        </AuthCardFooter>
    );
}
