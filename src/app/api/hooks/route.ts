// CRUD de ganchos guardados por el usuario
import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function GET() {
  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ hooks: [], guest: true });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ hooks: [], guest: true });

  const { data, error } = await supabase
    .from('hooks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ hooks: data || [] });
}

export async function POST(request: NextRequest) {
  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'Supabase no configurado' }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const body = await request.json();
  const payload = {
    user_id: user.id,
    tema: body.tema,
    hook_type: body.hook_type,
    hook_text: body.hook_text,
    platform: body.platform || 'instagram',
    tone: body.tone || 'casual',
    niche: body.niche || 'otro',
    is_favorite: body.is_favorite ?? false,
  };

  const { data, error } = await supabase.from('hooks').insert(payload).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ hook: data });
}

export async function PATCH(request: NextRequest) {
  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'Supabase no configurado' }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const body = await request.json();
  const { id, ...updates } = body;

  // Si marca "usado", incrementa contador + timestamp
  if (updates.mark_used) {
    const { data: current } = await supabase
      .from('hooks')
      .select('used_count')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    updates.used_count = (current?.used_count || 0) + 1;
    updates.last_used_at = new Date().toISOString();
    delete updates.mark_used;
  }

  const { data, error } = await supabase
    .from('hooks')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ hook: data });
}

export async function DELETE(request: NextRequest) {
  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'Supabase no configurado' }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 });

  const { error } = await supabase.from('hooks').delete().eq('id', id).eq('user_id', user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
