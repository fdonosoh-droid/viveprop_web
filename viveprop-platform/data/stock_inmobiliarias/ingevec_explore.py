"""
Explorador de ingevec.ecore.cl
Autenticacion + analisis del Excel() export en exe.aspx?idx=5629
"""

import requests
import re
import sys
from bs4 import BeautifulSoup

USER    = "agencia@databrokers.cl"
PASSWD  = "Ingevec2025*"
BASE    = "https://ingevec.ecore.cl"
STOCK_URL = f"{BASE}/com/mantenedor/exe.aspx?idx=5629&com=0&cnt=1&conbar=0&conalt="

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "es-CL,es;q=0.9",
}

s = requests.Session()
s.headers.update(HEADERS)


def login():
    print("[1] GET login page...")
    r = s.get(f"{BASE}/sys/int/log.aspx", timeout=30)
    print(f"    Status: {r.status_code}")

    soup = BeautifulSoup(r.text, "html.parser")

    # Collect ALL hidden fields
    payload = {}
    for inp in soup.find_all("input", {"type": "hidden"}):
        name = inp.get("name")
        val  = inp.get("value", "")
        if name:
            payload[name] = val
    print(f"    Hidden fields: {list(payload.keys())}")

    payload["usr"] = USER
    payload["psw"] = PASSWD

    print("[2] POST credentials...")
    r2 = s.post(
        f"{BASE}/sys/int/log.aspx",
        data=payload,
        allow_redirects=True,
        timeout=30,
        headers={"Referer": f"{BASE}/sys/int/log.aspx"},
    )
    print(f"    Status: {r2.status_code}  URL: {r2.url}")
    print(f"    Response length: {len(r2.text)}")
    print(f"    Cookies: {dict(s.cookies)}")

    # Check for error in response
    m_err = re.search(r'var\s+tmpErr\s*=\s*["\']([^"\']*)["\']', r2.text)
    m_inf = re.search(r'var\s+tmpInf\s*=\s*["\']([^"\']*)["\']', r2.text)
    if m_err:
        print(f"    tmpErr = '{m_err.group(1)}'")
    if m_inf:
        print(f"    tmpInf = '{m_inf.group(1)}'")

    # If still on login page, check for JS redirect
    if "log.aspx" in r2.url:
        loc = re.search(r'window\.(?:top\.)?location(?:\.href)?\s*=\s*["\']([^"\']+)["\']', r2.text)
        if loc:
            redir = loc.group(1)
            if not redir.startswith("http"):
                redir = f"{BASE}/sys/int/{redir}"
            print(f"[3] JS redirect to {redir}")
            r3 = s.get(redir, allow_redirects=True, timeout=30)
            print(f"    Status: {r3.status_code}  URL: {r3.url}")
            print(f"    Cookies: {dict(s.cookies)}")
        else:
            print("    Still on login page - check credentials or form structure")
            with open("C:/AI/stock_inmobiliarias/ingevec_login_resp2.html", "w", encoding="utf-8", errors="replace") as f:
                f.write(r2.text)
            print("    Saved to C:/AI/stock_inmobiliarias/ingevec_login_resp2.html")
            return False
    else:
        # If we landed somewhere else, check for JS redirect from there
        loc = re.search(r'window\.(?:top\.)?location(?:\.href)?\s*=\s*["\']([^"\']+)["\']', r2.text)
        if loc:
            redir = loc.group(1)
            if not redir.startswith("http"):
                from urllib.parse import urljoin
                redir = urljoin(r2.url, redir)
            print(f"[3] JS redirect to {redir}")
            r3 = s.get(redir, allow_redirects=True, timeout=30)
            print(f"    Status: {r3.status_code}  URL: {r3.url}")
            print(f"    Cookies: {dict(s.cookies)}")

    print(f"    Final cookies: {dict(s.cookies)}")
    return True


def get_stock_page():
    print(f"\n[AUTH CHECK] GET stock page...")
    r = s.get(STOCK_URL, allow_redirects=False, timeout=30)
    print(f"    Status: {r.status_code}  URL: {r.url}")
    if r.status_code in (301, 302):
        print(f"    Redirect to: {r.headers.get('Location','')}")
        return None
    js_redir = re.search(r'window\.(?:top\.)?location(?:\.href)?\s*=\s*["\']([^"\']+)["\']', r.text)
    if js_redir:
        print(f"    JS redirect to: {js_redir.group(1)}")
        return None
    return r


def main():
    print("=" * 60)
    print("  Ingevec - Debug login")
    print("=" * 60)

    ok = login()
    if not ok:
        sys.exit(1)

    r = get_stock_page()
    if r is None:
        print("\nNot authenticated - stock page redirects to login")
    else:
        print(f"\nAuthenticated! Page length: {len(r.text)}")
        # Look for Excel/export references
        excel_refs = re.findall(r'[Ee]xcel[^"\'<]{0,100}', r.text)
        print(f"Excel refs found: {excel_refs[:5]}")
        with open("C:/AI/stock_inmobiliarias/ingevec_page.html", "w", encoding="utf-8", errors="replace") as f:
            f.write(r.text)
        print("Saved to C:/AI/stock_inmobiliarias/ingevec_page.html")


if __name__ == "__main__":
    main()
