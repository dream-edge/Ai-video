'use client';
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        question: "Can I participate as a group?",
        answer: "No, participation is open to individuals only. Group or collaborative entries are not allowed."
    },
    {
        question: "What language should the video be in?",
        answer: "The video can be in Nepali or bilingual (Nepali + English). The essence of the ukhaan tukka should be clear."
    },
    {
        question: "Are there any restrictions on AI tools?",
        answer: "You can use any AI video generation tools. Multiple tools and manual editing after generation are allowed. However, heavy reliance on unmodified stock footage is discouraged."
    },
    {
        question: "How are winners selected?",
        answer: "Winners are selected strictly based on Instagram engagement (Views + Likes) recorded on the official @kec.lite handle by the cut-off date (Falgun 13, 2082)."
    },
    {
        question: "Can I share my video from my personal account?",
        answer: "Once posted on the official @kec.lite page, you must share it ONLY from that official handle. Reuploads or reposts from unofficial sources are prohibited."
    },
    {
        question: "What happens if I use fake engagement?",
        answer: "Any form of artificial engagement boosting (bots, paid promotions, engagement groups) will lead to immediate disqualification."
    },
    {
        question: "Can I submit more than one video?",
        answer: "No, only one submission per participant is allowed."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-16 md:py-24 bg-transparent">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-slate-600">
                        Common questions about the competition and rules.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border border-slate-200 rounded-2xl overflow-hidden hover:border-sky-300 hover:shadow-lg hover:shadow-sky-500/5 transition-all duration-300 bg-white"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50/50 transition-colors group"
                            >
                                <span className={`font-bold transition-colors duration-300 pr-4 ${openIndex === index ? 'text-sky-600' : 'text-slate-900 group-hover:text-sky-500'}`}>
                                    {faq.question}
                                </span>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${openIndex === index ? 'bg-sky-500 text-white rotate-180' : 'bg-slate-100 text-slate-400 group-hover:bg-sky-100 group-hover:text-sky-500'}`}>
                                    {openIndex === index ? (
                                        <Minus className="w-4 h-4" />
                                    ) : (
                                        <Plus className="w-4 h-4" />
                                    )}
                                </div>
                            </button>
                            <AnimatePresence initial={false}>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{
                                            height: "auto",
                                            opacity: 1,
                                            transition: {
                                                height: {
                                                    type: "spring",
                                                    stiffness: 300,
                                                    damping: 30
                                                },
                                                opacity: { duration: 0.2, delay: 0.1 }
                                            }
                                        }}
                                        exit={{
                                            height: 0,
                                            opacity: 0,
                                            transition: {
                                                height: { duration: 0.3, ease: "easeInOut" },
                                                opacity: { duration: 0.2 }
                                            }
                                        }}
                                    >
                                        <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4 bg-slate-50/30">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
