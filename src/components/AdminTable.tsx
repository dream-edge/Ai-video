'use client';
import { useState } from 'react';
import { Participant } from '@/types';
import { Trash2, Edit2, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase'; // We'll use this for deletion directly or via API

interface AdminTableProps {
    participants: Participant[];
    onRefresh: () => void;
    onEdit: (participant: Participant) => void;
}

export default function AdminTable({ participants, onRefresh, onEdit }: AdminTableProps) {
    const [loading, setLoading] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this participant?')) return;
        setLoading(id);
        try {
            const response = await fetch(`/api/participants/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed');
            onRefresh();
        } catch (error) {
            console.error("Delete failed", error);
            alert('Failed to delete participant');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
            <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 uppercase font-medium text-slate-500">
                    <tr>
                        <th className="px-6 py-4">Participant</th>
                        <th className="px-6 py-4">Video Title</th>
                        <th className="px-6 py-4 text-center">Likes</th>
                        <th className="px-6 py-4 text-center">Instagram</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-transparent">
                    {participants.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900">{p.name}</td>
                            <td className="px-6 py-4 max-w-xs truncate" title={p.video_title}>
                                {p.video_title}
                            </td>
                            <td className="px-6 py-4 text-center text-slate-900">{p.likes.toLocaleString()}</td>
                            <td className="px-6 py-4 text-center">
                                <a
                                    href={p.instagram_post_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block p-2 text-pink-500 hover:text-pink-400 hover:bg-pink-500/10 rounded-full transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </td>
                            <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                <button
                                    onClick={() => onEdit(p)}
                                    className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                                    title="Edit"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(p.id)}
                                    disabled={loading === p.id}
                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {participants.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                No participants found. Add one to get started.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
