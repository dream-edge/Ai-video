'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap-utils';
import { Shield, Book, Video, AlertTriangle, UserCheck, Calendar, Award } from 'lucide-react';

export default function DetailedRules() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.fromTo('.rule-card',
            { opacity: 0, y: 20 },
            {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 85%',
                },
                opacity: 1,
                y: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power2.out',
            }
        );
    }, { scope: sectionRef });

    const sections = [
        {
            title: "Theme Guidelines",
            icon: Book,
            content: [
                "Each submission must be inspired by one Nepali ukhaan tukka.",
                "The interpretation may be literal, metaphorical, humorous, abstract, or symbolic.",
                "Modernized or creative reinterpretations are encouraged.",
                "The video should clearly convey the essence or message of the chosen ukhaan or tukka."
            ]
        },
        {
            title: "Eligibility",
            icon: UserCheck,
            content: [
                "Open to all.",
                "Individual participation only.",
                "One submission per participant.",
                "Group or collaborative entries are not allowed."
            ]
        },
        {
            title: "Submission Requirements",
            icon: Video,
            content: [
                "Format: AI-generated video reel.",
                "Max Duration: 60 seconds.",
                "Orientation: Vertical (9:16 preferred).",
                "Language: Nepali or bilingual.",
                "Audio: Optional (background music or AI narration allowed).",
                "Text overlays: Allowed but should be minimal.",
                "Each participant must submit: Final video file, Selected ukhaan tukka, Short explanation (max 80 words), Primary AI tools used."
            ]
        },
        {
            title: "Use of AI Tools",
            icon: Shield,
            content: [
                "Any AI video generation tools may be used.",
                "Multiple tools are allowed.",
                "Manual editing after AI generation is permitted.",
                "Heavy reliance on unmodified stock footage is discouraged.",
                "Judging emphasizes creative direction and interpretation, not tool complexity."
            ]
        },
        {
            title: "Content Restrictions",
            icon: AlertTriangle,
            content: [
                "Submissions will be disqualified if they include: Nudity, hate speech, political propaganda, religious disrespect, graphic violence, plagiarized/copyrighted material.",
                "All content must respect Nepali culture and social values."
            ]
        },
        {
            title: "Originality & Fair Use",
            icon: Shield,
            content: [
                "Submissions must be original and unpublished.",
                "Previously posted or reused content is not allowed.",
                "Prompts and concepts must be created by the participant.",
                "Participants retain ownership but grant permission for event-related reposting."
            ]
        },
        {
            title: "Platform for Winner Determination",
            icon: Award,
            content: [
                "Only Instagram engagement will be considered for selecting winners.",
                "Engagement on Facebook or other platforms will not be counted.",
                "Valid Engagement Criteria (Instagram Only): Total Views and Total Likes.",
                "Comments, Shares, Saves, Story reshares are NOT considered.",
                "Sharing Rules: Once posted, participants must share ONLY from the official handle @kec.lite."
            ]
        },
        {
            title: "Timeline & Evaluation",
            icon: Calendar,
            content: [
                "Evaluation Cut-Off Date: Wednesday, Falgun 13, 2082.",
                "Winner Announcement: Falgun 14, 2082 (LITE Day).",
                "Winners determined strictly based on Instagram views and likes at cut-off.",
                "In case of a tie, judging criteria scores may be used as a tie-breaker."
            ]
        }
    ];

    return (
        <section id="rules" ref={sectionRef} className="py-16 relative">
            <div className="absolute top-0 left-0 w-full h-full bg-transparent -z-10 rounded-3xl" />

            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Comprehensive Rules
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        To ensure transparency, consistency, and impartiality, the competition will strictly follow these guidelines.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {sections.map((section, idx) => {
                        const Icon = section.icon;
                        return (
                            <div key={idx} className="rule-card bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
                                        <Icon size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-slate-900 mb-3">{section.title}</h3>
                                        <ul className="space-y-2">
                                            {section.content.map((item, i) => (
                                                <li key={i} className="flex gap-2 text-slate-600 text-sm leading-relaxed">
                                                    <span className="text-sky-400 mt-1.5">•</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12 p-6 bg-amber-50 rounded-xl border border-amber-100 text-amber-900 text-sm md:text-base text-center max-w-4xl mx-auto">
                    <strong>Fairness & Transparency Assurance:</strong> No subjective judgment, manual favoritism, or platform-based bias will be applied. All participants are evaluated under the same conditions. The committee reserves the right to investigate engagement authenticity.
                </div>
            </div>
        </section>
    );
}
