import requests
import re
from bs4 import BeautifulSoup

USER   = "agencia@databrokers.cl"
PASSWD = "Ingevec2025*"
BASE   = "https://ingevec.ecore.cl"

s = requests.Session()
s.headers.update({"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"})

# Login
r = s.get(f"{BASE}/sys/int/log.aspx", timeout=30)
soup = BeautifulSoup(r.text, "html.parser")
payload = {inp["name"]: inp.get("value","") for inp in soup.find_all("input", {"type":"hidden"}) if inp.get("name")}
payload["usr"] = USER
payload["psw"] = PASSWD
r2 = s.post(f"{BASE}/sys/int/log.aspx", data=payload, allow_redirects=True, timeout=30)

# Follow JS redirect if on login page
if "log.aspx" in r2.url:
    loc = re.search(r'window\.(?:top\.)?location(?:\.href)?\s*=\s*["\']([^"\']+)["\']', r2.text)
    if loc:
        redir = loc.group(1)
        if not redir.startswith("http"):
            redir = f"{BASE}/sys/int/{redir}"
        s.get(redir, allow_redirects=True, timeout=30)

print(f"Cookies: {dict(s.cookies)}")

# Fetch exe.js
exejs_url = f"{BASE}/com/mantenedor/exe.js"
print(f"\nFetching {exejs_url} ...")
r3 = s.get(exejs_url, timeout=30)
print(f"Status: {r3.status_code}  Length: {len(r3.text)}")

with open("C:/AI/stock_inmobiliarias/exe.js", "w", encoding="utf-8", errors="replace") as f:
    f.write(r3.text)
print("Saved to C:/AI/stock_inmobiliarias/exe.js")

# Find NotionMantenedor_aExcel
m = re.search(r"function\s+NotionMantenedor_aExcel\s*\([^)]*\)\s*\{[^}]+\}", r3.text, re.DOTALL)
if m:
    print("\n=== NotionMantenedor_aExcel ===")
    print(m.group(0))
else:
    idx = r3.text.find("aExcel")
    if idx >= 0:
        print(f"\n=== Context around aExcel ===")
        print(r3.text[max(0,idx-200):idx+500])
    else:
        print("aExcel not found in exe.js")

# Also check execore.js
execore_url = f"{BASE}/com/mantenedor/execore.js"
print(f"\nFetching {execore_url} ...")
r4 = s.get(execore_url, timeout=30)
print(f"Status: {r4.status_code}  Length: {len(r4.text)}")
with open("C:/AI/stock_inmobiliarias/execore.js", "w", encoding="utf-8", errors="replace") as f:
    f.write(r4.text)
print("Saved to C:/AI/stock_inmobiliarias/execore.js")

idx2 = r4.text.find("aExcel")
if idx2 >= 0:
    print(f"\n=== Context around aExcel in execore.js ===")
    print(r4.text[max(0,idx2-200):idx2+500])
