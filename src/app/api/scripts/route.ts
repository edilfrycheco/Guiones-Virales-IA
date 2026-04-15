// CRUD de guiones guardados por el usuario
import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function GET() {
  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ scripts: [], guest: true });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ scripts: [], guest: true });

  const { data, error } = await supabase
    .from('scripts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ scripts: data || [] });
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
    framework: body.framework,
    hook_type: body.hook_type,
    platform: body.platform || 'instagram',
    tone: body.tone || 'casual',
    niche: body.niche || 'otro',
    length: body.length || 'medio',
    script_content: body.script_content,
    hook_id: body.hook_id || null,
    is_approved: body.is_approved ?? false,
    score: body.score ?? null,
  };

  const { data, error } = await supabase.from('scripts').insert(payload).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ script: data });
}

export async function PATCH(request: NextRequest) {
  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'Supabase no configurado' }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const body = await request.json();
  const { id, ...updates } = body;

  const { data, error } = await supabase
    .from('scripts')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ script: data });
}

export async function DELETE(request: NextRequest) {
  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'Supabase no configurado' }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 });

  const { error } = await supabase.from('scripts').delete().eq('id', id).eq('user_id', user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
