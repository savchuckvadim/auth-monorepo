import {APP_TITLE } from "@/modules/app";

export default function Head() {
    return (
        <>
            <title>{APP_TITLE}</title>

            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/pace-js@1/themes/blue/pace-theme-flash.css"
            />
        </>
    );
}
