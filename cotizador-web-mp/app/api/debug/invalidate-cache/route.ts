'use server'
import { NextResponse } from 'next/server'
import { invalidateExcelCache } from '@/lib/data/excel-adapter'

// POST /api/debug/invalidate-cache
// Limpia el singleton en memoria y fuerza releer INPUT_FILES.xlsx en la próxima request
export async function POST() {
  try {
    invalidateExcelCache()
    return NextResponse.json({ ok: true, mensaje: 'Caché invalidada. El Excel se recargará en la próxima request.' })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
