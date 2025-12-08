import React from 'react'

import {
    Body,
    Font,
    Head,

    Html,

    Preview,

    Tailwind,

} from '@react-email/components'
import { User } from 'generated/prisma'

interface RestrictionTemplateProps {
    user: User
    // restriction: Restriction
    violations: number
}

const baseUrl = process.env['SITE_URL']

export function RestrictionTemplate({ user, violations }: RestrictionTemplateProps) {


    return (
        <Html>
            <Head>
                <Font
                    fontFamily='Geist'
                    fallbackFontFamily='Arial'
                    webFont={{
                        url: 'https://fonts.googleapis.com/css2?family=Geist:wght@300;500;700&display=swap',
                        format: 'woff2'
                    }}
                />
            </Head>
            <Tailwind>
                <Body>
                    <Preview>Ваш аккаунт был ограничен</Preview>

                </Body>
            </Tailwind>
        </Html>
    )
}
