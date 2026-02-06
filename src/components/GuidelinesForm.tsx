'use client';
import { useState, useEffect } from 'react';
import { FileText, Save, RefreshCw } from 'lucide-react';

const DEFAULT_GUIDELINES = [
    "Each participant can submit only one video aligned with the theme.",
    "Public Voting: Likes and shares contribute to scoring. (1 reaction = 2 points, 1 share = 5 points).",
    "Participants must like and follow the official KEC LITE 2082 Facebook page.",
    "Prompt Length: Must not exceed 55–65 words.",
    "Videos with nudity, vulgarity, explicit contents or hatred will be disqualified.",
    "The organizing committee may ask for verification of the generated video.",
    "Participants must share their video publicly from the official page with the hashtags: #keclite #keclite2082 #aivideography.",
    "Generated videos and prompts must align with the theme: Imagine उखान टुक्का!"
];

export default function GuidelinesForm() {
    const [guidelines, setGuidelines] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const fetchGuidelines = async () => {
            try {
                const res = await fetch('/api/guidelines');
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setGuidelines(data.map((g: any) => g.content));
                    } else {
                        setGuidelines(DEFAULT_GUIDELINES);
                    }
                } else {
                    setGuidelines(DEFAULT_GUIDELINES);
                }
            } catch (error) {
                console.error("Failed to fetch guidelines:", error);
                setGuidelines(DEFAULT_GUIDELINES);
            } finally {
                setLoading(false);
            }
        };

        fetchGuidelines();
    }, []);

    const handleGuidelineChange = (index: number, value: string) => {
        const newGuidelines = [...guidelines];
        newGuidelines[index] = value;
        setGuidelines(newGuidelines);
    };

    const handleAddGuideline = () => {
        setGuidelines([...guidelines, ""]);
    };

    const handleRemoveGuideline = (index: number) => {
        setGuidelines(guidelines.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch('/api/guidelines', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guidelines }),
            });

            if (!res.ok) throw new Error('Failed to save');

            setMessage({ type: 'success', text: 'Guidelines saved successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save guidelines. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        if (confirm('Are you sure you want to reset to default guidelines?')) {
            setGuidelines(DEFAULT_GUIDELINES);
            // Optional: Auto-save on reset? Or let user click save. Let's let them click save.
            setMessage({ type: 'success', text: 'Resetted to defaults. Click Save to apply.' });
        }
    };

    if (loading) return <div className="text-center py-10">Loading guidelines...</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-sky-600" />
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Competition Guidelines</h2>
                            <p className="text-sm text-slate-500">Manage the rules displayed on the main page</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Reset to Defaults
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white text-sm font-bold rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-4 h-4" />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                        {message.text}
                    </div>
                )}

                <div className="space-y-4">
                    {guidelines.map((guideline, index) => (
                        <div key={index} className="flex gap-3 items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sm font-bold text-sky-600 mt-2">
                                {index + 1}
                            </div>
                            <div className="flex-1">
                                <textarea
                                    value={guideline}
                                    onChange={(e) => handleGuidelineChange(index, e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none resize-none text-slate-900 bg-white"
                                    rows={2}
                                    placeholder={`Guideline ${index + 1}`}
                                />
                            </div>
                            <button
                                onClick={() => handleRemoveGuideline(index)}
                                className="flex-shrink-0 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors mt-2"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleAddGuideline}
                    className="mt-4 w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-sky-400 hover:text-sky-600 font-medium transition-colors"
                >
                    + Add New Guideline
                </button>
            </div>

            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
                <p className="text-sm text-sky-800">
                    <strong>Note:</strong> Changes to guidelines will be reflected immediately on the main page after saving.
                </p>
            </div>
        </div>
    );
}
