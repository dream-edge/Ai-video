'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Participant, NewParticipant, UpdateParticipant } from '@/types';
import AdminTable from '@/components/AdminTable';
import AdminForm from '@/components/AdminForm';
import SettingsForm from '@/components/SettingsForm';
import GuidelinesForm from '@/components/GuidelinesForm';
import { Plus, LogOut, Settings as SettingsIcon, Users, FileText } from 'lucide-react';

export default function AdminDashboard() {
    const router = useRouter();
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingParticipant, setEditingParticipant] = useState<Participant | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'participants' | 'settings' | 'guidelines'>('participants');

    const fetchParticipants = async () => {
        const { data, error } = await supabase
            .from('participants')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setParticipants(data);
        setLoading(false);
    };

    useEffect(() => {
        // Basic client-side check, middleware should handle the actual protection
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/admin/login');
            } else {
                fetchParticipants();
            }
        };
        checkUser();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    const handleCreate = () => {
        setEditingParticipant(undefined);
        setIsFormOpen(true);
    };

    const handleEdit = (participant: Participant) => {
        setEditingParticipant(participant);
        setIsFormOpen(true);
    };

    const handleSubmit = async (data: NewParticipant | UpdateParticipant) => {
        try {
            if (editingParticipant) {
                const res = await fetch(`/api/participants/${editingParticipant.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(data),
                });
                if (!res.ok) throw new Error('Update failed');
            } else {
                const res = await fetch('/api/participants', {
                    method: 'POST',
                    body: JSON.stringify(data),
                });
                if (!res.ok) {
                    const err = await res.json().catch(() => ({ error: 'Create failed' }));
                    throw new Error(err.error || 'Create failed');
                }
            }
            setIsFormOpen(false);
            fetchParticipants();
        } catch (error) {
            console.error(error);
            alert('Operation failed');
        }
    };

    if (loading) return <div className="text-center py-20">Loading dashboard...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 text-sm">Manage ranking and site settings</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-200 pb-4">
                <button
                    onClick={() => { setActiveTab('participants'); setIsFormOpen(false); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'participants' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
                >
                    <Users className="w-4 h-4" />
                    Participants
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
                >
                    <SettingsIcon className="w-4 h-4" />
                    Site Settings
                </button>
                <button
                    onClick={() => { setActiveTab('guidelines'); setIsFormOpen(false); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'guidelines' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
                >
                    <FileText className="w-4 h-4" />
                    Guidelines
                </button>
            </div>

            {activeTab === 'participants' ? (
                <>
                    <div className="flex justify-end">
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Participant
                        </button>
                    </div>

                    {isFormOpen ? (
                        <AdminForm
                            initialData={editingParticipant}
                            onSubmit={handleSubmit}
                            onCancel={() => setIsFormOpen(false)}
                            isEditing={!!editingParticipant}
                        />
                    ) : (
                        <AdminTable
                            participants={participants}
                            onRefresh={fetchParticipants}
                            onEdit={handleEdit}
                        />
                    )}
                </>
            ) : activeTab === 'settings' ? (
                <SettingsForm />
            ) : (
                <GuidelinesForm />
            )}
        </div>
    );
}
