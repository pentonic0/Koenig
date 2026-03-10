'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const KoenigNextEditor = dynamic(() => import('../components/KoenigNextEditor'), {
    ssr: false
});

const initialHtml = `
    <p>Welcome to the standalone Koenig editor in Next.js.</p>
    <h2>It keeps the full card + formatting feature set</h2>
    <ul>
        <li>Rich text</li>
        <li>Headings</li>
        <li>Lists</li>
        <li>Links</li>
        <li>Code blocks</li>
        <li>Image, embed, and other cards</li>
    </ul>
`;

export default function Page() {
    return (
        <main style={{padding: '24px 0'}}>
            <h1 style={{fontSize: '28px', fontWeight: 700, margin: '0 auto 16px', maxWidth: '820px', padding: '0 20px'}}>
                Koenig Editor (Next.js)
            </h1>
            <KoenigNextEditor initialHtml={initialHtml} />
        </main>
    );
}
