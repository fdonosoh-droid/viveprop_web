from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse

from ..services.excel_loader import DataStore

router = APIRouter(tags=["stock"])


@router.get("/stock")
def get_stock():
    """Devuelve el array completo de propiedades secundarias (usadas)."""
    return JSONResponse(DataStore.stock)


@router.get("/geocodes")
def get_geocodes():
    """Devuelve coordenadas cacheadas para el stock secundario."""
    return JSONResponse(DataStore.geocodes)


@router.post("/data/reload")
def reload_data():
    """Recarga todos los datos desde los archivos Excel. Útil tras editar los .xlsx."""
    DataStore.load()
    return {
        "ok": True,
        "stock":    len(DataStore.stock),
        "projects": len(DataStore.projects),
        "cc":       len(DataStore.cc_data),
    }
