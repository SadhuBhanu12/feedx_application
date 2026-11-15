import json

path = r"C:\Users\BHANU\.gemini\antigravity-ide\brain\88de4923-5051-4b5d-93f0-25963739ba37\.system_generated\logs\transcript.jsonl"
with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    d = json.loads(line)
    if d.get("type") == "PLANNER_RESPONSE":
        thinking = d.get("thinking", "")
        # Look for keywords
        if any(w in thinking.lower() for w in ["splash", "icon", "progress", "token", "media", "community", "profile", "quiz", "quick learn"]):
            print(f"--- Step {i} ---")
            print(thinking[:400].replace("\n", " "))
