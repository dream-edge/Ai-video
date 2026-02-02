'use client';
import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { Heart, ExternalLink } from 'lucide-react';
import { Participant } from '@/types';
import { gsap, useGSAP } from '@/lib/gsap-utils';

interface ParticipantCardProps {
    participant: Participant;
    index: number;
}

export default function ParticipantCard({ participant, index }: ParticipantCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const likesRef = useRef<HTMLSpanElement>(null);
    const heartRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Hover animations
        const card = cardRef.current;
        if (!card) return;

        const hoverTl = gsap.timeline({ paused: true });

        hoverTl
            .to(card, {
                y: -12,
                scale: 1.03,
                rotationY: 5,
                rotationX: 2,
                z: 50,
                boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.25)',
                duration: 0.5,
                ease: 'expo.out'
            })
            .to(heartRef.current, {
                scale: 1.3,
                duration: 0.3,
                yoyo: true,
                repeat: 1,
                ease: 'back.out(2)'
            }, '<');

        const enter = () => hoverTl.play();
        const leave = () => hoverTl.reverse();

        card.addEventListener('mouseenter', enter);
        card.addEventListener('mouseleave', leave);

        return () => {
            card.removeEventListener('mouseenter', enter);
            card.removeEventListener('mouseleave', leave);
        };
    }, { scope: cardRef });

    useEffect(() => {
        // Animate likes number when it changes
        if (likesRef.current) {
            gsap.fromTo(likesRef.current,
                { scale: 1.5, color: '#ec4899' },
                { scale: 1, color: 'inherit', duration: 0.6, ease: 'expo.out' }
            );
        }
    }, [participant.likes]);

    return (
        <div
            ref={cardRef}
            className="participant-card relative w-full bg-white border border-slate-200 rounded-2xl overflow-hidden group shadow-sm"
        >
            {/* Instagram Embed Placeholder/Thumbnail */}
            <div className="relative aspect-[4/5] w-full bg-slate-100">
                {/* In a real app, we might check if it's an image or video URL, or use an embed. 
             For this demo, we'll try to use the instagram_post_url to fetch an image or just show a placeholder 
             if we can't easily validly embed without an access token. 
             Ideally the backend would provide a valid thumbnail URL.
          */}
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
                    {/* 
                 Priority 1: Manual Thumbnail URL (from Admin)
                 Priority 2: Instagram Hack (/media/?size=l)
                 Fallback: Gradient Placeholder
             */}
                    <Image
                        src={participant.thumbnail_url || `${participant.instagram_post_url}/media/?size=l`}
                        alt={participant.video_title}
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                        unoptimized // Needed for external domains
                        onError={(e) => {
                            // Fallback if the image fails to load
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement?.classList.add('fallback-gradient');
                        }}
                    />
                    <div className="fallback-placeholder absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-700 flex items-center justify-center -z-10">
                        <span className="text-sm font-mono opacity-30">Instagram Content</span>
                    </div>
                </div>
            </div>

            {/* Likes hidden for now
            <div className="absolute top-4 right-4 z-10">
                <div className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
                    <div ref={heartRef}><Heart className="w-3 h-3 text-pink-500 fill-pink-500" /></div>
                    <span ref={likesRef}>{participant.likes.toLocaleString()}</span>
                </div>
            </div>
            */}


            <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">{participant.video_title}</h3>
                <p className="text-sm text-slate-500 mb-4">{participant.name}</p>

                <a
                    href={participant.instagram_post_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                    View on Instagram <ExternalLink className="w-4 h-4" />
                </a>
            </div>
        </div >
    );
}
