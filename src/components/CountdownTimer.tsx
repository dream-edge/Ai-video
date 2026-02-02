'use client';
import { useRef, useState, useEffect } from 'react';
import { gsap, useGSAP } from '@/lib/gsap-utils';

interface CountdownTimerProps {
    targetDate: string;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(targetDate).getTime() - now;

            if (distance < 0) {
                clearInterval(interval);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    useGSAP(() => {
        gsap.from('.countdown-item', {
            y: 20,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: 'back.out(1.7)',
        });
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="flex gap-4 md:gap-8 justify-center my-8">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="countdown-item flex flex-col items-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-black/5 border border-black/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <span className="text-2xl md:text-3xl font-bold text-slate-900">
                            {String(value).padStart(2, '0')}
                        </span>
                    </div>
                    <span className="text-xs uppercase tracking-wider text-slate-600 mt-2 font-bold">{unit}</span>
                </div>
            ))}
        </div>
    );
}
