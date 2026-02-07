'use client';
import { useRef, useState, useEffect } from 'react';
import { gsap, useGSAP } from '@/lib/gsap-utils';
import { CheckCircle2, AlertCircle, Share2, Hash, FileText, Shield } from 'lucide-react';

export default function Guidelines() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [guidelineItems, setGuidelineItems] = useState<{ icon: any, text: string, highlight?: string }[]>([]);
    const [loading, setLoading] = useState(true);

    const ICONS = [FileText, Share2, CheckCircle2, FileText, Shield, AlertCircle, Hash, CheckCircle2];
    const HIGHLIGHTS = [
        "one video",
        "Public Voting",
        "like and follow",
        "Prompt Length",
        "",
        "verification",
        "#keclite #keclite2082 #aivideography",
        "Imagine उखान टुक्का!"
    ];

    useEffect(() => {
        const fetchGuidelines = async () => {
            try {
                const res = await fetch('/api/guidelines');
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        const items = data.map((item: any, index: number) => ({
                            icon: ICONS[index % ICONS.length],
                            text: item.content,
                            highlight: HIGHLIGHTS[index] || "" // Attempt to match highlights by index, or empty if new items
                        }));
                        setGuidelineItems(items);
                    } else {
                        // Fallback if DB empty (shouldn't happen if migration ran)
                        useDefaultGuidelines();
                    }
                } else {
                    useDefaultGuidelines();
                }
            } catch (error) {
                console.error("Failed to fetch guidelines:", error);
                useDefaultGuidelines();
            } finally {
                setLoading(false);
            }
        };

        const useDefaultGuidelines = () => {
            const defaults = [
                {
                    icon: FileText,
                    text: "Each participant can submit only one video aligned with the theme.",
                    highlight: "one video"
                },
                {
                    icon: Share2,
                    text: "Public Voting: Likes and shares contribute to scoring. (1 reaction = 2 points, 1 share = 5 points).",
                    highlight: "Public Voting"
                },
                {
                    icon: CheckCircle2,
                    text: "Participants must like and follow the official KEC LITE 2082 Facebook page.",
                    highlight: "like and follow"
                },
                {
                    icon: FileText,
                    text: "Prompt Length: Must not exceed 55–65 words.",
                    highlight: "Prompt Length"
                },
                {
                    icon: Shield,
                    text: "Videos with nudity, vulgarity, explicit contents or hatred will be disqualified.",
                    highlight: ""
                },
                {
                    icon: AlertCircle,
                    text: "The organizing committee may ask for verification of the generated video.",
                    highlight: "verification"
                },
                {
                    icon: Hash,
                    text: "Participants must share their video publicly from the official page with the hashtags: #keclite #keclite2082 #aivideography.",
                    highlight: "#keclite #keclite2082 #aivideography"
                },
                {
                    icon: CheckCircle2,
                    text: "Generated videos and prompts must align with the theme: Imagine उखान टुक्का!",
                    highlight: "Imagine उखान टुक्का!"
                }
            ];
            setGuidelineItems(defaults);
        };

        fetchGuidelines();
    }, []);

    useGSAP(() => {
        if (loading) return;

        gsap.fromTo('.guideline-item',
            { opacity: 0, y: 30 },
            {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                },
                opacity: 1,
                y: 0,
                stagger: 0.08,
                duration: 0.8,
                ease: 'power2.out',
            }
        );
    }, { scope: sectionRef, dependencies: [loading] });

    if (loading) return null; // Or a loading skeleton

    return (
        <section ref={sectionRef} className="py-16 relative">
            <div className="absolute top-0 left-0 w-full h-full bg-transparent -z-10 rounded-3xl" />

            <div className="max-w-5xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 flex items-center justify-center gap-3">
                        <span className="w-2 h-10 bg-sky-500 rounded-full inline-block" />
                        Guidelines
                    </h2>
                    <p className="text-slate-600 text-lg">Please read carefully before participating</p>
                </div>

                <div className="space-y-3">
                    {guidelineItems.map((guideline, index) => {
                        const Icon = guideline.icon;
                        return (
                            <div
                                key={index}
                                className="guideline-item bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-sky-300 transition-all duration-300 group"
                            >
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center group-hover:bg-sky-200 transition-colors">
                                            <span className="text-sm font-bold text-sky-600">{index + 1}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-slate-900 leading-relaxed">
                                            {guideline.highlight ? (
                                                <>
                                                    {guideline.text.split(guideline.highlight).map((part, i, arr) => (
                                                        <span key={i}>
                                                            {part}
                                                            {i < arr.length - 1 && (
                                                                <strong className="font-bold text-slate-900">{guideline.highlight}</strong>
                                                            )}
                                                        </span>
                                                    ))}
                                                </>
                                            ) : (
                                                guideline.text
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>


            </div>
        </section>
    );
}
