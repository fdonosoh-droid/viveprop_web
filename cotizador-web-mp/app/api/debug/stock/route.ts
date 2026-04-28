'use server'
import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import path from 'path'
import fs from 'fs'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'INPUT_FILES.xlsx')

    // Verificar que el archivo existe
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: `Archivo no encontrado: ${filePath}` }, { status: 404 })
    }

    const stat = fs.statSync(filePath)
    const wb = XLSX.readFile(filePath, { cellDates: true, dense: false })

    const hojas = wb.SheetNames

    // Para cada hoja relevante, muestra encabezados y conteo de filas
    const resumen: Record<string, unknown> = {
      archivo: filePath,
      modificado: stat.mtime.toISOString(),
      tamano_bytes: stat.size,
      hojas_encontradas: hojas,
    }

    for (const nombre of ['STOCK NUEVOS', 'CONDICIONES_COMERCIALES', 'PROYECTOS', 'UF', 'REGLAS_INMOBILIARIAS', 'PARAMETROS_CALCULO']) {
      const ws = wb.Sheets[nombre]
      if (!ws) {
        resumen[nombre] = { error: 'Hoja NO encontrada' }
        continue
      }
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: null })
      const headers = rows.length > 0 ? Object.keys(rows[0]) : []
      resumen[nombre] = {
        filas: rows.length,
        columnas: headers,
        primera_fila: rows[0] ?? null,
      }
    }

    // Muestra qué comunas, entregas, inmobiliarias hay en STOCK NUEVOS
    const stockWs = wb.Sheets['STOCK NUEVOS']
    if (stockWs) {
      const stockRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(stockWs, { defval: null })
      const disponibles = stockRows.filter((r) => String(r['ESTADO STOCK']).trim() === 'Disponible')
      resumen['diagnostico_stock'] = {
        total_filas: stockRows.length,
        disponibles: disponibles.length,
        estados_encontrados: [...new Set(stockRows.map((r) => String(r['ESTADO STOCK']).trim()))],
        comunas_en_stock: [...new Set(disponibles.map((r) => String(r['COMUNA'] ?? '').trim()))].filter(Boolean).sort(),
        alianzas_en_stock: [...new Set(disponibles.map((r) => String(r['ALIANZA'] ?? '').trim()))].filter(Boolean).sort(),
        tipos_entrega_en_stock: [...new Set(disponibles.map((r) => String(r['TIPO ENTREGA'] ?? '').trim()))].filter(Boolean).sort(),
      }

      // Muestra comunas que cruzan con PROYECTOS
      const proyWs = wb.Sheets['PROYECTOS']
      if (proyWs) {
        const proyRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(proyWs, { defval: null })
        const nemosDisp = new Set(disponibles.map((r) => String(r['NEMOTECNICO'] ?? '').trim()))
        const proyFiltrados = proyRows.filter((p) => nemosDisp.has(String(p['NEMOTECNICO'] ?? '').trim()))
        resumen['diagnostico_proyectos'] = {
          total_proyectos: proyRows.length,
          proyectos_con_stock_disponible: proyFiltrados.length,
          comunas_visibles: [...new Set(proyFiltrados.map((p) => String(p['COMUNA'] ?? '').trim()))].filter(Boolean).sort(),
          nemotecnicos_en_stock_no_en_proyectos: [...nemosDisp].filter(
            (n) => !proyRows.some((p) => String(p['NEMOTECNICO'] ?? '').trim() === n)
          ),
        }
      }
    }

    return NextResponse.json(resumen, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
