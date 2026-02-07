'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { gsap, useGSAP } from '@/lib/gsap-utils';

export default function Navbar() {
    const navRef = useRef<HTMLElement>(null);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useGSAP(() => {
        gsap.from(navRef.current, {
            y: -100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
        });
    }, { scope: navRef });

    return (
        <nav
            ref={navRef}
            className={`fixed top-0 left-0 right-0 z-50 py-2 transition-all duration-300 ${isScrolled
                ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50'
                : 'bg-transparent'
                }`}
        >
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
                            src="/logo-dark.png"
                            alt="LITE Exhibition"
                            width={100}
                            height={50}
                            className="h-10 w-auto object-contain"
                        />
                    </div>
                </Link>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-6 mr-4">
                        <Link href="#rules" className="text-sm font-medium text-slate-700 hover:text-sky-600 transition-colors relative group">
                            Rules
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-600 transition-all group-hover:w-full"></span>
                        </Link>
                        <Link href="#faq" className="text-sm font-medium text-slate-700 hover:text-sky-600 transition-colors relative group">
                            FAQ
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-600 transition-all group-hover:w-full"></span>
                        </Link>
                    </div>
                    <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLSfN7IB-erEYkGqxvxpGX28E-LeZgsUpcWU7gSu_AsyBjGUYRw/viewform"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-sm font-medium bg-black text-white rounded-full hover:bg-gray-800 transition-colors transform hover:scale-105 active:scale-95 duration-200"
                    >
                        Join Competition
                    </a>
                </div>
            </div>
        </nav>
    );
}
