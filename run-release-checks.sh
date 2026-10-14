#!/usr/bin/env bash
set -u
cd "$(dirname "$0")/.."
fail=0
for f in shadow-clash-forest-3d.html; do
  python3 - "$f" <<'PY'
import re,sys
s=open(sys.argv[1],encoding='utf-8').read()
blocks=re.findall(r'<script(?:\s[^>]*)?>([\s\S]*?)</script>',s,re.I)
for i,b in enumerate(blocks):
    if b.strip():
        open(f'/tmp/shadow-clash-inline-{i}.js','w',encoding='utf-8').write(b)
print(f'Extracted {sum(bool(b.strip()) for b in blocks)} inline JavaScript blocks')
PY
  for js in /tmp/shadow-clash-inline-*.js; do
    if node --check "$js"; then echo "PASS syntax: $js"; else fail=1; fi
  done
done
for t in tests/run1.js tests/run2.js tests/run4.js tests/run5.js tests/run7.js tests/run8.js tests/dom_test.js tests/cap_run.js; do
  echo "===== $t ====="
  if node "$t"; then :; else fail=1; echo "FAIL: $t"; fi
done
exit "$fail"
