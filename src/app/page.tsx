'use client';
import { useEffect, useState, useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '@/lib/gsap-utils';
import ParticipantCard from '@/components/ParticipantCard';
import CountdownTimer from '@/components/CountdownTimer';
import { Participant } from '@/types';
import { supabase } from '@/lib/supabase';

// Mock data for initial render or fallback
const MOCK_PARTICIPANTS: Participant[] = [];

export default function Home() {
    const [participants, setParticipants] = useState<Participant[]>(MOCK_PARTICIPANTS);
    const [settings, setSettings] = useState({
        theme: 'AI Videography Challenge',
        description: 'Voting is live! Support your favorite creators by liking their posts on Instagram.',
        target_date: '2026-03-01T00:00:00'
    });
    const [loading, setLoading] = useState(true);
    const heroRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    const fetchData = async () => {
        try {
            // Fetch Settings
            const settingsData = await fetch('/api/settings', { cache: 'no-store' }).then(res => res.json());

            if (settingsData && settingsData.theme) {
                setSettings(settingsData);
            }

            // Fetch Participants
            const { data, error } = await supabase
                .from('participants')
                .select('*')
                .order('likes', { ascending: false });

            if (data) setParticipants(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Auto-refresh every 5 minutes
        const interval = setInterval(fetchData, 5 * 60 * 1000);

        // Subscribe to realtime updates
        const channel = supabase.channel('public:participants')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'participants' }, () => {
                fetchData();
            })
            .subscribe();

        return () => {
            clearInterval(interval);
            supabase.removeChannel(channel);
        };
    }, []);

    useGSAP(() => {
        const tl = gsap.timeline();

        // Hero Animations
        tl.from('.hero-text', {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
        });

        // Scroll Trigger for cards section
        if (cardsRef.current) {
            ScrollTrigger.batch('.participant-card', {
                start: 'top 85%',
                onEnter: batch => gsap.from(batch, {
                    opacity: 0,
                    y: 50,
                    stagger: 0.15,
                    duration: 0.8,
                    ease: 'power3.out'
                }),
                once: true // animate only once
            });
        }

    }, { scope: heroRef });

    return (
        <div ref={heroRef} className="space-y-16">
            {/* Hero Section */}
            <section className="text-center py-12 md:py-20 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-sky-400/30 blur-[130px] -z-10 rounded-full" />

                <h1 className="hero-text text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-slate-900 via-sky-500 to-slate-500 bg-clip-text text-transparent mb-2">
                    AI Videography Challenge
                </h1>
                <h2 className="hero-text text-xl md:text-2xl font-medium text-sky-600 mb-6">
                    Theme: {settings.theme}
                </h2>
                <p className="hero-text text-lg text-slate-700 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                    {settings.description}
                </p>

                <div className="hero-text">
                    <CountdownTimer targetDate={settings.target_date} />
                </div>
            </section>

            {/* Leaderboard Grid */}
            <section ref={cardsRef} className="min-h-[50vh]">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
                        <span className="w-2 h-8 bg-indigo-600 rounded-full inline-block" />
                        Creators
                    </h2>
                    <div className="text-sm text-slate-600 font-medium">
                        {participants.length} entries
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="animate-pulse bg-white/5 rounded-2xl aspect-[4/5]" />
                        ))}
                    </div>
                ) : participants.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 perspective-1000">
                        {participants.map((participant, index) => (
                            <ParticipantCard
                                key={participant.id}
                                participant={participant}
                                index={index}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                        <p className="text-xl text-gray-400">No participants yet. Be the first to join!</p>
                    </div>
                )}
            </section>
        </div>
    );
}
