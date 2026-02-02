'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, AlertCircle } from 'lucide-react';
import { Settings } from '@/types';

export default function SettingsForm() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<Settings>();

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                if (data) {
                    // Convert UTC date to local datetime-local string for input
                    const date = new Date(data.target_date);
                    // Format: YYYY-MM-DDThh:mm
                    const localIsoString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
                        .toISOString()
                        .slice(0, 16);

                    reset({
                        ...data,
                        target_date: localIsoString
                    });
                }
            } catch (error) {
                console.error('Failed to fetch settings', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, [reset]);

    const onSubmit = async (data: Settings) => {
        setSaving(true);
        try {
            // Convert local time back to UTC ISO string
            const utcDate = new Date(data.target_date).toISOString();

            const res = await fetch('/api/settings', {
                method: 'PUT',
                body: JSON.stringify({
                    ...data,
                    target_date: utcDate
                }),
            });

            if (!res.ok) throw new Error('Failed to update settings');
            alert('Settings updated successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-gray-400">Loading settings...</div>;

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xl max-w-2xl">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Site Configuration</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Competition Theme / Title</label>
                    <input
                        {...register('theme', { required: 'Theme is required' })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors placeholder:text-slate-400"
                        placeholder="e.g. AI Photography Challenge"
                    />
                    {errors.theme && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.theme.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description / Subtitle</label>
                    <textarea
                        {...register('description', { required: 'Description is required' })}
                        rows={4}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors placeholder:text-slate-400"
                        placeholder="Description of the event..."
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.description.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Target Date (End of Voting)</label>
                    <input
                        type="datetime-local"
                        {...register('target_date', { required: 'Date is required' })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                    />
                    {errors.target_date && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.target_date.message}</p>}
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Saving...' : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
