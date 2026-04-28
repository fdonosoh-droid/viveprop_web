from fastapi import APIRouter
from fastapi.responses import JSONResponse

from ..services.excel_loader import DataStore

router = APIRouter(tags=["projects"])


@router.get("/projects")
def get_projects():
    """Devuelve el array completo de proyectos de mercado primario."""
    return JSONResponse(DataStore.projects)


@router.get("/pri-geocodes")
def get_pri_geocodes():
    """Devuelve coordenadas cacheadas para proyectos primarios."""
    return JSONResponse(DataStore.pri_geocodes)
