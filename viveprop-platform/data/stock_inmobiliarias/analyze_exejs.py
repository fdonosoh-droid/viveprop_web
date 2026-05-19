import re

with open("C:/AI/stock_inmobiliarias/exe.js", "r", encoding="utf-8", errors="replace") as f:
    js = f.read()

# Find the full aExcel function with nested braces
def extract_function(src, fname):
    """Extract full function body by counting braces."""
    start_pat = re.compile(r'function\s+' + re.escape(fname) + r'\s*\([^)]*\)\s*\{')
    m = start_pat.search(src)
    if not m:
        return None
    pos = m.end() - 1  # position of opening brace
    depth = 0
    for i in range(pos, len(src)):
        if src[i] == '{':
            depth += 1
        elif src[i] == '}':
            depth -= 1
            if depth == 0:
                return src[m.start():i+1]
    return None

# Get aExcel
fn = extract_function(js, "NotionMantenedor_aExcel")
if fn:
    print("=== NotionMantenedor_aExcel ===")
    print(fn[:3000])
else:
    print("Not found")

# Get NotionTable_CheckUnitario
fn2 = extract_function(js, "NotionTable_CheckUnitario")
if fn2:
    print("\n=== NotionTable_CheckUnitario ===")
    print(fn2[:1000])

# Look for any URL construction with 'exp' or 'excel' in the JS
print("\n=== URL patterns ===")
for m in re.finditer(r'["\'][^"\']*(?:exp|excel|xls|export)[^"\']*["\']', js, re.IGNORECASE):
    print(" ", m.group(0))

# Look for form submit or AJAX calls
print("\n=== AJAX/submit patterns ===")
for m in re.finditer(r'(?:\.post|\.get|\.ajax|submit|document\.location|window\.location)\s*[(\[].{0,200}', js, re.DOTALL):
    snippet = m.group(0)[:200].replace('\n', ' ')
    if any(x in snippet.lower() for x in ['exp', 'excel', 'xls', 'pag', 'acc']):
        print(" ", snippet)
        print()
