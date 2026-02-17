'use client';

import React from 'react';

const flatIcons = [
    { name: 'Hard Hat (Regular)', path: '/icons/flat-hard-hat.svg' },
    { name: 'Hard Hat (Duotone)', path: '/icons/flat-hard-hat-duotone.svg' },
    { name: 'Crane (Regular)', path: '/icons/flat-crane.svg' },
    { name: 'Crane (Duotone)', path: '/icons/flat-crane-duotone.svg' },
    { name: 'Traffic Cone (Regular)', path: '/icons/flat-traffic-cone.svg' },
    { name: 'Hammer (Regular)', path: '/icons/flat-hammer.svg' },
    { name: 'Wrench (Regular)', path: '/icons/flat-wrench.svg' },
    { name: 'Wrench (Duotone)', path: '/icons/flat-wrench-duotone.svg' },
    { name: 'Warning (Regular)', path: '/icons/flat-warning.svg' },
];

const oldIcons = [
    { name: 'Binoculars (Old)', path: '/icons/binoculars.svg' },
    { name: 'Warning Octagon (Old)', path: '/icons/warning-octagon.svg' },
];

export default function IconPreviewPage() {
    return (
        <div className="p-8 bg-white min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-[#4A5A7A]">Превью іконок "Flat" (Phosphor Icons)</h1>
            <p className="text-slate-500 mb-8">Ці іконки взяті з папки /docs/SVGs_Flat/</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                {flatIcons.map((icon) => (
                    <div key={icon.path} className="flex flex-col items-center p-6 border border-slate-100 rounded-2xl bg-white shadow-sm hover:border-[#4A5A7A]/30 transition-all">
                        <div className="w-16 h-16 mb-4 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100">
                            <img src={icon.path} alt={icon.name} className="w-10 h-10 text-[#4A5A7A]" />
                        </div>
                        <span className="text-sm font-semibold text-slate-700 mb-1">{icon.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{icon.path}</span>
                    </div>
                ))}
            </div>

            <h1 className="text-xl font-bold mb-4 text-slate-400">Попередні варіанти (для порівняння)</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 opacity-60">
                {oldIcons.map((icon) => (
                    <div key={icon.path} className="flex flex-col items-center p-6 border border-slate-100 rounded-2xl bg-white shadow-sm grayscale">
                        <div className="w-16 h-16 mb-4 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100">
                            <img src={icon.path} alt={icon.name} className="w-10 h-10" />
                        </div>
                        <span className="text-sm font-semibold text-slate-700 mb-1">{icon.name}</span>
                    </div>
                ))}
            </div>

            <div className="mt-12 p-6 bg-[#4A5A7A] rounded-2xl text-white">
                <h2 className="text-lg font-bold mb-2">Як використовувати:</h2>
                <p className="text-sm opacity-80 mb-4">
                    Іконки Hard Hat або Traffic Cone найкраще підходять під опис "Under Construction".
                </p>
                <div className="bg-black/20 p-4 rounded-xl">
                    <code className="text-xs font-mono break-all text-emerald-300">
                        &lt;img src="/icons/flat-hard-hat.svg" className="w-8 h-8" /&gt;
                    </code>
                </div>
            </div>
        </div>
    );
}
