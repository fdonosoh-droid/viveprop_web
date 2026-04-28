from fastapi import APIRouter
from fastapi.responses import JSONResponse

from ..services.excel_loader import DataStore

router = APIRouter(tags=["cc"])


@router.get("/cc")
def get_cc():
    """Devuelve el objeto CC_DATA con condiciones comerciales por proyecto."""
    return JSONResponse(DataStore.cc_data)
