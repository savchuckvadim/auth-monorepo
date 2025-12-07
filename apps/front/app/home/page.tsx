import React from 'react';
import { Hero2 } from './components/Hero2';




export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col scrollbar-hide">
            {/* <Header /> */}
            <main className="flex-grow">
                home page
                <Hero2 />

            </main>

        </div>
    );
}

