// DELETE /api/reference-scripts/[id]
import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const query = supabase
      .from('reference_scripts')
      .delete()
      .eq('id', params.id);

    // Only scope by user_id when authenticated
    if (user) {
      query.eq('user_id', user.id);
    }

    const { error } = await query;
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno' },
      { status: 500 }
    );
  }
}
