import { getSupabaseServer } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await getSupabaseServer()

    const { data, error } = await supabase.from("maintenance_status").select("*").limit(1).single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch maintenance status" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const supabase = await getSupabaseServer()

    const { data, error } = await supabase
      .from("maintenance_status")
      .update({
        is_active: body.is_active,
        start_time: body.start_time,
        end_time: body.end_time,
        title: body.title,
        message: body.message,
        updated_at: new Date().toISOString(),
      })
      .eq("id", "00000000-0000-0000-0000-000000000001")
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update maintenance status" }, { status: 500 })
  }
}
