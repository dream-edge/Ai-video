'use client';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, AlertCircle } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsap-utils';
import { NewParticipant, Participant, UpdateParticipant } from '@/types';
import { isValidInstagramUrl, generateIdFromUrl } from '@/utils/validators';

interface AdminFormProps {
    initialData?: Participant;
    onSubmit: (data: NewParticipant | UpdateParticipant) => Promise<void>;
    onCancel: () => void;
    isEditing: boolean;
}

interface FormData {
    name: string;
    video_title: string;
    instagram_post_url: string;
    thumbnail_url?: string | null;
    likes?: number;
}

export default function AdminForm({ initialData, onSubmit, onCancel, isEditing }: AdminFormProps) {
    const formRef = useRef<HTMLDivElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset, setValue, setError } = useForm<FormData>({
        defaultValues: initialData || { likes: 0 }
    });

    useGSAP(() => {
        gsap.from(formRef.current, {
            x: 50,
            opacity: 0,
            duration: 0.5,
            ease: 'power3.out'
        });
    }, { scope: formRef });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    const onFormSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            if (!isValidInstagramUrl(data.instagram_post_url)) {
                setError('instagram_post_url', {
                    type: 'manual',
                    message: 'Invalid Instagram URL'
                });
                setIsSubmitting(false);
                return;
            }

            const instagram_post_id = generateIdFromUrl(data.instagram_post_url);
            if (!instagram_post_id) {
                setError('instagram_post_url', {
                    type: 'manual',
                    message: 'Could not extract Post ID from URL'
                });
                setIsSubmitting(false);
                return;
            }

            const payload = {
                ...data,
                instagram_post_id
            };

            await onSubmit(payload);
        } catch (e) {
            console.error(e);
            // Error handling should be done by parent or improved here
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div ref={formRef} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">{isEditing ? 'Edit Participant' : 'Add New Participant'}</h2>
                <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Participant Name</label>
                    <input
                        {...register('name', { required: 'Name is required' })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors placeholder:text-slate-400"
                        placeholder="e.g. John Doe"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Video Title</label>
                    <input
                        {...register('video_title', { required: 'Video title is required' })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors placeholder:text-slate-400"
                        placeholder="e.g. AI Masterpiece"
                    />
                    {errors.video_title && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.video_title.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Instagram Post URL</label>
                    <input
                        {...register('instagram_post_url', { required: 'Instagram URL is required' })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors placeholder:text-slate-400"
                        placeholder="https://www.instagram.com/p/..."
                    />
                    {errors.instagram_post_url && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.instagram_post_url.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Thumbnail</label>
                    <div className="space-y-3">
                        {/* URL Input */}
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Option 1: Paste Image URL</p>
                            <input
                                {...register('thumbnail_url')}
                                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors placeholder:text-slate-400"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="text-center text-xs text-slate-100 border-b border-slate-200 leading-[0.1em] my-2">
                            <span className="bg-white text-slate-400 px-2">OR</span>
                        </div>

                        {/* File Upload */}
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Option 2: Upload Image</p>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    try {
                                        setIsSubmitting(true);
                                        // 1. Upload to Supabase Storage
                                        const fileExt = file.name.split('.').pop();
                                        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
                                        const filePath = `${fileName}`;

                                        const { error: uploadError } = await (await import('@/lib/supabase')).supabase.storage
                                            .from('thumbnails')
                                            .upload(filePath, file);

                                        if (uploadError) throw uploadError;

                                        // 2. Get Public URL
                                        const { data: { publicUrl } } = await (await import('@/lib/supabase')).supabase.storage
                                            .from('thumbnails')
                                            .getPublicUrl(filePath);

                                        // 3. Set value in form
                                        setValue('thumbnail_url', publicUrl);

                                        // Visual feedback (optional: use toast)
                                        console.log('File uploaded:', publicUrl);
                                    } catch (error: any) {
                                        console.error('Upload failed:', error);
                                        alert('Upload failed: ' + error.message);
                                    } finally {
                                        setIsSubmitting(false);
                                    }
                                }}
                                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-all cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Likes Count</label>
                        <input
                            type="number"
                            {...register('likes', { valueAsNumber: true })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>
                )}

                <div className="pt-4 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Saving...' : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Participant
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
