'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap-utils';

export default function Navbar() {
    const navRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        gsap.from(navRef.current, {
            y: -100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
        });
    }, { scope: navRef });

    return (
        <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-transparent py-2">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-4 group hover:opacity-90 transition-opacity">
                    <div className="relative flex items-center gap-4">
                        <Image
                            src="/images/kec-logo.png"
                            alt="KEC Computer Club"
                            width={50}
                            height={50}
                            className="h-12 w-auto object-contain"
                        />
                        <div className="h-8 w-px bg-black/10"></div>
                        <Image
                            src="/images/lite-logo.png"
                            alt="LITE Exhibition"
                            width={100}
                            height={50}
                            className="h-10 w-auto object-contain"
                        />
                    </div>
                </Link>

                <div className="flex items-center gap-6">
                    <Link
                        href="/register"
                        className="px-4 py-2 text-sm font-medium bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                    >
                        Join Competition
                    </Link>
                </div>
            </div>
        </nav>
    );
}
