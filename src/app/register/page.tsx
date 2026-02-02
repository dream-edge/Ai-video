'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap-utils';

export default function RegisterPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from(containerRef.current, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="max-w-4xl mx-auto space-y-8 py-10">
            <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
                    Join the Challenge
                </h1>
                <p className="text-slate-500 text-lg">
                    Fill out the form below to register your entry.
                </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden min-h-[800px] relative">
                {/* Google Form Embed */}
                {/* Replace the URL below with your actual Google Form embed link */}
                <iframe
                    src="https://docs.google.com/forms/d/e/1FAIpQLSee2jNzt8pctpfysBS1pd05bS2gJgRz_MYkVi7vYUAc4f7dRw/viewform?embedded=true"
                    width="100%"
                    height="800"
                    frameBorder="0"
                    marginHeight={0}
                    marginWidth={0}
                    className="w-full h-[800px]"
                >
                    Loading…
                </iframe>
            </div>

            <div className="text-center">
                <p className="text-sm text-slate-400">
                    Having trouble? Contact support or try again later.
                </p>
            </div>
        </div>
    );
}
