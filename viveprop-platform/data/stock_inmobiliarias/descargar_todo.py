"""
Descarga consolidada de stock - Todas las inmobiliarias
Corre los tres scripts en secuencia y muestra un resumen final.
"""

import subprocess
import sys
import os
from datetime import datetime

SCRIPTS = [
    ("EUROCORP",  "eurocorp.py"),
    ("URMENETA",  "urmeneta.py"),
    ("INGEVEC",   "ingevec.py"),
]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def run_script(name, filename):
    script_path = os.path.join(BASE_DIR, filename)
    print(f"\n{'=' * 60}")
    print(f"  {name}")
    print(f"{'=' * 60}")
    result = subprocess.run(
        [sys.executable, script_path],
        cwd=BASE_DIR,
    )
    return result.returncode == 0


def main():
    inicio = datetime.now()
    print("=" * 60)
    print("  DESCARGA DE STOCK - TODAS LAS INMOBILIARIAS")
    print(f"  {inicio.strftime('%d/%m/%Y  %H:%M')}")
    print("=" * 60)

    resultados = []
    for name, filename in SCRIPTS:
        ok = run_script(name, filename)
        resultados.append((name, ok))

    fin = datetime.now()
    duracion = int((fin - inicio).total_seconds())

    print(f"\n{'=' * 60}")
    print("  RESUMEN FINAL")
    print(f"{'=' * 60}")
    for name, ok in resultados:
        estado = "OK" if ok else "ERROR"
        print(f"  {name:<15} {estado}")
    print(f"\n  Duracion total: {duracion // 60}m {duracion % 60}s")
    print(f"  Archivos en: {BASE_DIR}")
    print("=" * 60)

    errores = [n for n, ok in resultados if not ok]
    if errores:
        print(f"\n  ATENCION: fallaron {', '.join(errores)}")
        print("  Probablemente tokens vencidos - ver instrucciones en cada script.")
    else:
        print("\n  Todos los archivos descargados correctamente.")


if __name__ == "__main__":
    main()
