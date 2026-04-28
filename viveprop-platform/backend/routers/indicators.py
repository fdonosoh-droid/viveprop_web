from fastapi import APIRouter, HTTPException

from ..services.uf_cache import get_uf

router = APIRouter(tags=["indicators"])


@router.get("/uf")
async def get_uf_value():
    """Devuelve el valor actual de la UF (cacheado 1 hora)."""
    try:
        return await get_uf()
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
