"""
Obtiene el valor de la UF desde mindicador.cl y lo cachea por 1 hora.
"""
from __future__ import annotations
import asyncio
from datetime import datetime, timedelta

import httpx

_cache: dict = {"valor": None, "fecha": None, "expires": datetime.min}
_lock = asyncio.Lock()

UF_URL = "https://mindicador.cl/api/uf"


async def get_uf() -> dict:
    async with _lock:
        if datetime.now() < _cache["expires"] and _cache["valor"] is not None:
            return {"valor": _cache["valor"], "fecha": _cache["fecha"]}
        try:
            async with httpx.AsyncClient(timeout=5) as client:
                r = await client.get(UF_URL)
                r.raise_for_status()
                data = r.json()
                serie = data.get("serie", [])
                if serie:
                    _cache["valor"]   = serie[0]["valor"]
                    _cache["fecha"]   = serie[0]["fecha"][:10]
                    _cache["expires"] = datetime.now() + timedelta(hours=1)
        except Exception as exc:
            # Devolver último valor conocido si hay error de red
            if _cache["valor"] is None:
                raise RuntimeError(f"No se pudo obtener la UF: {exc}") from exc
        return {"valor": _cache["valor"], "fecha": _cache["fecha"]}
