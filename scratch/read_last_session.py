import json

path = r"C:\Users\BHANU\.gemini\antigravity-ide\brain\88de4923-5051-4b5d-93f0-25963739ba37\.system_generated\logs\transcript.jsonl"
with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()

print(f"Total lines in previous session: {len(lines)}")
for i in range(max(0, len(lines) - 20), len(lines)):
    d = json.loads(lines[i])
    step_type = d.get("type")
    source = d.get("source")
    tools = [c.get("name") for c in d.get("tool_calls", [])]
    thinking = d.get("thinking", "")
    content = d.get("content", "")
    print(f"\n--- Line {i} [{source} | {step_type}] ---")
    if tools:
        print(f"Tools called: {tools}")
        for c in d.get("tool_calls", []):
            print(f"  Tool: {c.get('name')}, args: {c.get('args')}")
    if content:
        print(f"Content preview: {content[:300]}")
    if thinking:
        print(f"Thinking preview: {thinking[:300]}")
