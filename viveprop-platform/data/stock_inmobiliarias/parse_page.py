import re

with open("C:/AI/stock_inmobiliarias/ingevec_page.html", "r", encoding="utf-8", errors="replace") as f:
    html = f.read()

# Look for NotionMantenedor_aExcel
print("=== NotionMantenedor_aExcel context ===")
for m in re.finditer(r".{0,200}NotionMantenedor_aExcel.{0,300}", html, re.DOTALL):
    print(m.group(0))
    print()

# All Notion function calls
print("\n=== All Notion function calls ===")
funcs = re.findall(r"NotionMantenedor_\w+\([^)]*\)", html)
for f in set(funcs):
    print(" ", f[:200])

# Script src references
print("\n=== Script src ===")
srcs = re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', html)
for src in srcs:
    print(" ", src)

# Look for export-related links
print("\n=== Export links ===")
links = re.findall(r'href=["\']([^"\']*(?:exp|excel|export|xls)[^"\']*)["\']', html, re.IGNORECASE)
for l in links:
    print(" ", l)

# Look for form action
print("\n=== Form action ===")
forms = re.findall(r'<form[^>]+action=["\']([^"\']+)["\']', html, re.IGNORECASE)
for f in forms:
    print(" ", f)

# Hidden fields
print("\n=== Hidden fields ===")
hidden = re.findall(r'<input[^>]+type=["\']hidden["\'][^>]*>', html, re.IGNORECASE)
for h in hidden[:20]:
    name_m = re.search(r'name=["\']([^"\']+)["\']', h)
    val_m  = re.search(r'value=["\']([^"\']*)["\']', h)
    if name_m:
        name = name_m.group(1)
        val  = val_m.group(1)[:40] if val_m else ""
        print(f"  {name} = {val}")
