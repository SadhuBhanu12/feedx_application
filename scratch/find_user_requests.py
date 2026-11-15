import json, re

path = r'C:\Users\BHANU\.gemini\antigravity-ide\brain\61756ebc-7723-483c-919b-10ae34e25d0a\.system_generated\logs\transcript.jsonl'
with open(path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            d = json.loads(line)
            if d.get('type') == 'USER_INPUT':
                idx = d.get('step_index')
                c = d.get('content', '')
                m = re.search(r'<USER_REQUEST>(.*?)</USER_REQUEST>', c, re.DOTALL)
                req = m.group(1).strip() if m else c[:200]
                print(f"=== Step {idx} ===")
                print(req)
        except Exception:
            pass
