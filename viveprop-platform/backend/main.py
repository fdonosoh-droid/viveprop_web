"""
ViveProp Platform — FastAPI backend
Sirve datos desde los archivos Excel en data/ y actúa como proxy para APIs externas.
"""
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .services.excel_loader import DataStore
from .routers import stock, projects, cc_data, indicators


@asynccontextmanager
async def lifespan(app: FastAPI):
    DataStore.load()
    yield


app = FastAPI(
    title="ViveProp API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5176", "http://127.0.0.1:5176"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stock.router,      prefix="/api")
app.include_router(projects.router,   prefix="/api")
app.include_router(cc_data.router,    prefix="/api")
app.include_router(indicators.router, prefix="/api")

# Servir el build de Vite en producción
_static = Path(__file__).parent / "static"
if _static.exists():
    app.mount("/", StaticFiles(directory=_static, html=True), name="spa")
