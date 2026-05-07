"""
probe_assetplan_api.py — Descubre la estructura del endpoint de listado masivo de AssetPlan.
Corre este script y comparte el output para configurar el importer completo.

Uso: python tools/probe_assetplan_api.py
"""
import json, sys
import requests
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE = "https://api.assetplan.cl/api/v1"

CANDIDATES = [
    f"{BASE}/property/for_sale",
    f"{BASE}/property/for_sale?list=1",
    f"{BASE}/property/for_sale?page=1",
    f"{BASE}/property/for_sale?page=1&per_page=10",
    f"{BASE}/properties/for_sale",
    f"{BASE}/properties/for_sale?page=1",
    f"{BASE}/property?for_sale=true&page=1",
]

session = requests.Session()
session.headers.update({"Accept": "application/json"})

print("=== Probando endpoints AssetPlan ===\n")

for url in CANDIDATES:
    try:
        r = session.get(url, timeout=10)
        print(f"[{r.status_code}] {url}")
        if r.status_code == 200:
            try:
                data = r.json()
                top_keys = list(data.keys()) if isinstance(data, dict) else f"array[{len(data)}]"
                print(f"       → keys: {top_keys}")
                if isinstance(data, dict):
                    for k, v in data.items():
                        if k == "data":
                            print(f"       → data: {len(v)} items")
                            if v:
                                print(f"       → data[0] keys: {list(v[0].keys())[:15]}")
                        elif k != "data":
                            print(f"       → {k}: {v}")
            except Exception as e:
                print(f"       → parse error: {e}")
                print(f"       → raw (200 chars): {r.text[:200]}")
        print()
    except Exception as e:
        print(f"[ERR] {url} — {e}\n")

session.close()
print("=== Fin probe ===")
