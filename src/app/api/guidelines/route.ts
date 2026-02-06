import { NextResponse } from 'next/server';
import { supabase, getServiceSupabase } from '@/lib/supabase';

// GET remains public, so we can use the regular client (respecting RLS public policy)
export async function GET() {
    try {
        const { data, error } = await supabase
            .from('guidelines')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch guidelines' },
            { status: 500 }
        );
    }
}

// POST requires admin privileges, so we use the Service Role key to bypass RLS
export async function POST(request: Request) {
    try {
        const { guidelines } = await request.json();

        if (!Array.isArray(guidelines)) {
            return NextResponse.json(
                { error: 'Invalid data format' },
                { status: 400 }
            );
        }

        // Use Service Role client to bypass RLS for admin operations
        const adminSupabase = getServiceSupabase();

        // Strategy: Delete all existing active guidelines and insert new ones
        // This ensures the order is exactly as submitted and handles removals

        // 1. Delete all
        const { error: deleteError } = await adminSupabase
            .from('guidelines')
            .delete()
            .neq('id', 0); // Delete all

        if (deleteError) throw deleteError;

        // 2. Insert new
        const newGuidelines = guidelines.map((content: string, index: number) => ({
            content,
            display_order: index + 1,
            is_active: true
        }));

        if (newGuidelines.length > 0) {
            const { error: insertError } = await adminSupabase
                .from('guidelines')
                .insert(newGuidelines);

            if (insertError) throw insertError;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving guidelines:', error);
        return NextResponse.json(
            { error: 'Failed to save guidelines' },
            { status: 500 }
        );
    }
}
