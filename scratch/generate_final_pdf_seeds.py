import re
import json
import os

with open("scratch/pdf_extracted_text.txt", "r", encoding="utf-8") as f:
    raw_text = f.read()

# Clean page markers and headers
cleaned = re.sub(r'--- PAGE \d+ ---\s*', '', raw_text)
cleaned = re.sub(r'FEEDX Polytechnic Community • Quick Learn & Quiz Content Library\s*', '', cleaned)

# Split Part A (Quick Learns) and Part B (Quizzes)
parts = re.split(r'PART B[^\n]*', cleaned, flags=re.IGNORECASE)
part_a_raw = parts[0]
part_b_raw = parts[1] if len(parts) > 1 else ""

# Metadata mappings
METADATA = {
    1: {"branch": "CSE", "category": "DevOps", "difficulty": "Beginner"},
    2: {"branch": "CSE", "category": "Web Dev", "difficulty": "Beginner"},
    3: {"branch": "CSE", "category": "Cloud", "difficulty": "Beginner"},
    4: {"branch": "CSE", "category": "Security", "difficulty": "Beginner"},
    5: {"branch": "CSE", "category": "OS", "difficulty": "Beginner"},
    6: {"branch": "CSE", "category": "OS", "difficulty": "Intermediate"},
    7: {"branch": "CSE", "category": "Networking", "difficulty": "Intermediate"},
    8: {"branch": "CSE", "category": "Web Dev", "difficulty": "Beginner"},
    9: {"branch": "CSE", "category": "Web Dev", "difficulty": "Beginner"},
    10: {"branch": "CSE", "category": "Programming", "difficulty": "Beginner"},
    11: {"branch": "CSE", "category": "Programming", "difficulty": "Beginner"},
    12: {"branch": "CSE", "category": "Programming", "difficulty": "Beginner"},
    13: {"branch": "CSE", "category": "Programming", "difficulty": "Intermediate"},
    14: {"branch": "CSE", "category": "Databases", "difficulty": "Intermediate"},
    15: {"branch": "CSE", "category": "DevOps", "difficulty": "Beginner"},
    16: {"branch": "CSE", "category": "Networking", "difficulty": "Intermediate"},
    17: {"branch": "CSE", "category": "Networking", "difficulty": "Intermediate"},
    18: {"branch": "CSE", "category": "Web Dev", "difficulty": "Intermediate"},
    19: {"branch": "CSE", "category": "Mobile Dev", "difficulty": "Intermediate"},
    20: {"branch": "CSE", "category": "Backend", "difficulty": "Intermediate"},
    21: {"branch": "CSE", "category": "Backend", "difficulty": "Intermediate"},
    22: {"branch": "CSE", "category": "DevOps", "difficulty": "Intermediate"},
    23: {"branch": "CSE", "category": "DevOps", "difficulty": "Advanced"},
    24: {"branch": "CSE", "category": "DSA", "difficulty": "Beginner"},
    25: {"branch": "CSE", "category": "DSA", "difficulty": "Intermediate"},
    26: {"branch": "CSE", "category": "DSA", "difficulty": "Intermediate"},
    27: {"branch": "CSE", "category": "Programming", "difficulty": "Intermediate"},
    28: {"branch": "CSE", "category": "Software Eng", "difficulty": "Intermediate"},
    29: {"branch": "CSE", "category": "Backend", "difficulty": "Advanced"},
    30: {"branch": "CSE", "category": "Backend", "difficulty": "Intermediate"},
    31: {"branch": "CSE", "category": "Architecture", "difficulty": "Advanced"},
    32: {"branch": "CSE", "category": "DevOps", "difficulty": "Intermediate"},
    33: {"branch": "AI & ML", "category": "AI", "difficulty": "Beginner"},
    34: {"branch": "AI & ML", "category": "ML", "difficulty": "Intermediate"},
    35: {"branch": "AI & ML", "category": "AI", "difficulty": "Advanced"},
    36: {"branch": "CSE", "category": "Security", "difficulty": "Advanced"},
    37: {"branch": "CSE", "category": "Security", "difficulty": "Intermediate"},
    38: {"branch": "ECE", "category": "IoT", "difficulty": "Intermediate"},
    39: {"branch": "ECE", "category": "Electronics", "difficulty": "Intermediate"},
    40: {"branch": "ECE", "category": "Electronics", "difficulty": "Beginner"},
    41: {"branch": "ECE", "category": "Telecom", "difficulty": "Intermediate"},
    42: {"branch": "EEE", "category": "Electrical", "difficulty": "Intermediate"},
    43: {"branch": "MECH", "category": "Mechanical", "difficulty": "Intermediate"},
    44: {"branch": "MECH", "category": "Mechanical", "difficulty": "Intermediate"},
    45: {"branch": "CIVIL", "category": "Civil", "difficulty": "Beginner"},
    46: {"branch": "MECH", "category": "Design", "difficulty": "Intermediate"},
    47: {"branch": "CSE", "category": "Management", "difficulty": "Beginner"},
    48: {"branch": "CSE", "category": "Data Science", "difficulty": "Intermediate"},
    49: {"branch": "CSE", "category": "Web3", "difficulty": "Advanced"},
    50: {"branch": "CSE", "category": "Cloud", "difficulty": "Advanced"}
}

def escape_sql(text):
    if not text:
        return ""
    return text.replace("'", "''")

def make_slug(title):
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s-]+', '-', slug).strip('-')
    return slug

# ==============================================================================
# PARSE QUICK LEARNS
# ==============================================================================
ql_regex = re.compile(r'Quick Learn (\d{2})\s*—\s*([^\n]+)', re.IGNORECASE)
ql_matches = list(ql_regex.finditer(part_a_raw))

quick_learns = []

for idx, match in enumerate(ql_matches):
    ql_num = int(match.group(1))
    ql_title = match.group(2).strip()
    
    start_pos = match.end()
    end_pos = ql_matches[idx + 1].start() if idx + 1 < len(ql_matches) else len(part_a_raw)
    ql_block = part_a_raw[start_pos:end_pos]
    
    learning_match = re.search(r'Learning Text\s*\n([\s\S]*?)(?=Key Points|$)', ql_block, re.IGNORECASE)
    learning_text = learning_match.group(1).strip() if learning_match else ""
    learning_text = re.sub(r'\s+', ' ', learning_text)
    
    kp_match = re.search(r'Key Points\s*\n([\s\S]*?)(?=15 MCQs|$)', ql_block, re.IGNORECASE)
    kp_text = kp_match.group(1).strip() if kp_match else ""
    key_points = []
    for line in kp_text.split('\n'):
        clean_line = re.sub(r'^[●\s•\-\*\u200b]+', '', line).strip()
        if clean_line and clean_line != '●' and clean_line != '\u200b':
            key_points.append(clean_line)
            
    mcq_match = re.search(r'15 MCQs\s*\n([\s\S]*)', ql_block, re.IGNORECASE)
    mcq_block = mcq_match.group(1) if mcq_match else ql_block
    
    q_regex = re.compile(r'Q(\d+)\.\s*([^\n]+)', re.IGNORECASE)
    q_matches = list(q_regex.finditer(mcq_block))
    
    questions = []
    for q_idx, q_m in enumerate(q_matches):
        q_num = int(q_m.group(1))
        q_text = q_m.group(2).strip()
        
        q_start = q_m.end()
        q_end = q_matches[q_idx + 1].start() if q_idx + 1 < len(q_matches) else len(mcq_block)
        q_body = mcq_block[q_start:q_end]
        
        opt_a_m = re.search(r'[●\s•]*A\.\s*([^\n]+)', q_body)
        opt_b_m = re.search(r'[●\s•]*B\.\s*([^\n]+)', q_body)
        opt_c_m = re.search(r'[●\s•]*C\.\s*([^\n]+)', q_body)
        opt_d_m = re.search(r'[●\s•]*D\.\s*([^\n]+)', q_body)
        ans_exp_m = re.search(r'Answer:\s*([A-D])\s*\|\s*Explanation:\s*([^\n]+)', q_body, re.IGNORECASE)
        
        if opt_a_m and opt_b_m and opt_c_m and opt_d_m and ans_exp_m:
            questions.append({
                "id": f"00000000-0001-4000-a000-{ql_num:06d}{q_num:06d}",
                "lesson_id": f"00000000-0000-4000-a000-{ql_num:012d}",
                "question_number": q_num,
                "question_text": f"Q{q_num}. {q_text}",
                "option_a": opt_a_m.group(1).strip(),
                "option_b": opt_b_m.group(1).strip(),
                "option_c": opt_c_m.group(1).strip(),
                "option_d": opt_d_m.group(1).strip(),
                "correct_option": ans_exp_m.group(1).strip().upper(),
                "explanation": ans_exp_m.group(2).strip()
            })
            
    meta = METADATA.get(ql_num, {"branch": "CSE", "category": "General", "difficulty": "Beginner"})
    
    # Build markdown content
    md_content = f"### Learning Text\n{learning_text}\n\n### Key Points\n" + "\n".join([f"- **{kp}**" for kp in key_points])
    
    quick_learns.append({
        "id": f"00000000-0000-4000-a000-{ql_num:012d}",
        "num": ql_num,
        "title": ql_title,
        "slug": make_slug(ql_title),
        "branch": meta["branch"],
        "category": meta["category"],
        "difficulty": meta["difficulty"],
        "short_description": f"Master {ql_title} fundamentals with quick reading and {len(questions)} practice MCQs on FEEDX.",
        "content_markdown": md_content,
        "questions": questions
    })

# ==============================================================================
# PARSE QUIZZES
# ==============================================================================
quiz_regex = re.compile(r'Quiz (\d{2})\s*—\s*([^\n]+)', re.IGNORECASE)
quiz_matches = list(quiz_regex.finditer(part_b_raw))

quizzes = []

for idx, match in enumerate(quiz_matches):
    qz_num = int(match.group(1))
    qz_title = match.group(2).strip()
    
    start_pos = match.end()
    end_pos = quiz_matches[idx + 1].start() if idx + 1 < len(quiz_matches) else len(part_b_raw)
    qz_block = part_b_raw[start_pos:end_pos]
    
    q_regex = re.compile(r'Q(\d+)\.\s*([^\n]+)', re.IGNORECASE)
    q_matches = list(q_regex.finditer(qz_block))
    
    questions = []
    for q_idx, q_m in enumerate(q_matches):
        q_num = int(q_m.group(1))
        q_text = q_m.group(2).strip()
        
        q_start = q_m.end()
        q_end = q_matches[q_idx + 1].start() if q_idx + 1 < len(q_matches) else len(qz_block)
        q_body = qz_block[q_start:q_end]
        
        opt_a_m = re.search(r'[●\s•]*A\.\s*([^\n]+)', q_body)
        opt_b_m = re.search(r'[●\s•]*B\.\s*([^\n]+)', q_body)
        opt_c_m = re.search(r'[●\s•]*C\.\s*([^\n]+)', q_body)
        opt_d_m = re.search(r'[●\s•]*D\.\s*([^\n]+)', q_body)
        ans_exp_m = re.search(r'Answer:\s*([A-D])\s*\|\s*Explanation:\s*([^\n]+)', q_body, re.IGNORECASE)
        
        if opt_a_m and opt_b_m and opt_c_m and opt_d_m and ans_exp_m:
            questions.append({
                "id": f"00000000-0003-4000-a000-{qz_num:06d}{q_num:06d}",
                "quiz_id": f"00000000-0002-4000-a000-{qz_num:012d}",
                "question_number": q_num,
                "question_text": f"Q{q_num}. {q_text}",
                "option_a": opt_a_m.group(1).strip(),
                "option_b": opt_b_m.group(1).strip(),
                "option_c": opt_c_m.group(1).strip(),
                "option_d": opt_d_m.group(1).strip(),
                "correct_option": ans_exp_m.group(1).strip().upper(),
                "explanation": ans_exp_m.group(2).strip()
            })
            
    meta = METADATA.get(qz_num, {"branch": "CSE", "category": "General", "difficulty": "Beginner"})
    
    quizzes.append({
        "id": f"00000000-0002-4000-a000-{qz_num:012d}",
        "num": qz_num,
        "title": f"{qz_title} Challenge Quiz",
        "description": f"Test your knowledge on {qz_title} with {len(questions)} comprehensive questions.",
        "branch": meta["branch"],
        "category": meta["category"],
        "difficulty": meta["difficulty"],
        "question_count": len(questions),
        "questions": questions
    })

print(f"Parsed {len(quick_learns)} Quick Learns with {sum(len(q['questions']) for q in quick_learns)} MCQs")
print(f"Parsed {len(quizzes)} Quizzes with {sum(len(q['questions']) for q in quizzes)} MCQs")

# ==============================================================================
# GENERATE SQL SEEDS
# ==============================================================================

# Quick Learns SQL
ql_sql = "-- ==============================================================================\n"
ql_sql += "-- FEEDX AUTHENTIC PDF SEED MIGRATION: QUICK LEARNS\n"
ql_sql += "-- ==============================================================================\n\n"
ql_sql += "BEGIN;\n\n"
ql_sql += "TRUNCATE TABLE public.student_lesson_progress CASCADE;\n"
ql_sql += "TRUNCATE TABLE public.quick_learn_checks CASCADE;\n"
ql_sql += "TRUNCATE TABLE public.quick_learn_lessons CASCADE;\n\n"

for ql in quick_learns:
    ql_sql += f"-- Quick Learn {ql['num']:02d}: {ql['title']}\n"
    ql_sql += f"INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)\n"
    ql_sql += f"VALUES (\n"
    ql_sql += f"  '{ql['id']}',\n"
    ql_sql += f"  '{escape_sql(ql['title'])}',\n"
    ql_sql += f"  '{ql['slug']}',\n"
    ql_sql += f"  '{ql['branch']}',\n"
    ql_sql += f"  '{ql['category']}',\n"
    ql_sql += f"  '{ql['difficulty']}',\n"
    ql_sql += f"  3,\n  TRUE,\n  10,\n"
    ql_sql += f"  '{escape_sql(ql['short_description'])}',\n"
    ql_sql += f"  '{escape_sql(ql['content_markdown'])}',\n"
    ql_sql += f"  TRUE\n"
    ql_sql += f") ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;\n\n"
    
    for q in ql["questions"]:
        ql_sql += f"INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)\n"
        ql_sql += f"VALUES (\n"
        ql_sql += f"  '{q['id']}',\n"
        ql_sql += f"  '{q['lesson_id']}',\n"
        ql_sql += f"  '{escape_sql(q['question_text'])}',\n"
        ql_sql += f"  '{escape_sql(q['option_a'])}',\n"
        ql_sql += f"  '{escape_sql(q['option_b'])}',\n"
        ql_sql += f"  '{escape_sql(q['option_c'])}',\n"
        ql_sql += f"  '{escape_sql(q['option_d'])}',\n"
        ql_sql += f"  '{q['correct_option']}',\n"
        ql_sql += f"  '{escape_sql(q['explanation'])}'\n"
        ql_sql += f") ON CONFLICT (id) DO NOTHING;\n"
    ql_sql += "\n"

ql_sql += "COMMIT;\n"

# Quizzes SQL
qz_sql = "-- ==============================================================================\n"
qz_sql += "-- FEEDX AUTHENTIC PDF SEED MIGRATION: QUIZZES\n"
qz_sql += "-- ==============================================================================\n\n"
qz_sql += "BEGIN;\n\n"
qz_sql += "TRUNCATE TABLE public.explore_quiz_attempts CASCADE;\n"
qz_sql += "TRUNCATE TABLE public.explore_quiz_questions CASCADE;\n"
qz_sql += "TRUNCATE TABLE public.explore_quizzes CASCADE;\n\n"

for qz in quizzes:
    qz_sql += f"-- Explore Quiz {qz['num']:02d}: {qz['title']}\n"
    qz_sql += f"INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)\n"
    qz_sql += f"VALUES (\n"
    qz_sql += f"  '{qz['id']}',\n"
    qz_sql += f"  '{escape_sql(qz['title'])}',\n"
    qz_sql += f"  '{escape_sql(qz['description'])}',\n"
    qz_sql += f"  '{qz['category']}',\n"
    qz_sql += f"  '{qz['branch']}',\n"
    qz_sql += f"  '{qz['difficulty']}',\n"
    qz_sql += f"  {qz['question_count']},\n  8,\n  15,\n  FALSE,\n  TRUE\n"
    qz_sql += f") ON CONFLICT (id) DO NOTHING;\n\n"
    
    for q in qz["questions"]:
        qz_sql += f"INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)\n"
        qz_sql += f"VALUES (\n"
        qz_sql += f"  '{q['id']}',\n"
        qz_sql += f"  '{q['quiz_id']}',\n"
        qz_sql += f"  {q['question_number']},\n"
        qz_sql += f"  '{escape_sql(q['question_text'])}',\n"
        qz_sql += f"  '{escape_sql(q['option_a'])}',\n"
        qz_sql += f"  '{escape_sql(q['option_b'])}',\n"
        qz_sql += f"  '{escape_sql(q['option_c'])}',\n"
        qz_sql += f"  '{escape_sql(q['option_d'])}',\n"
        qz_sql += f"  '{q['correct_option']}',\n"
        qz_sql += f"  '{escape_sql(q['explanation'])}'\n"
        qz_sql += f") ON CONFLICT (id) DO NOTHING;\n"
    qz_sql += "\n"

qz_sql += "COMMIT;\n"

# Write master SQL files
with open("supabase/seed_1_quick_learns.sql", "w", encoding="utf-8") as f:
    f.write(ql_sql)

with open("supabase/seed_2_quizzes.sql", "w", encoding="utf-8") as f:
    f.write(qz_sql)

with open("supabase/seed_content_library.sql", "w", encoding="utf-8") as f:
    f.write(ql_sql + "\n\n" + qz_sql)

# Now split into 4 small, modular files (under 400 KB each)
dir = "supabase"
ql_parts = ql_sql.split(r'-- Quick Learn 26:')
ql_part1 = ql_parts[0] + '\nCOMMIT;'
ql_part2 = 'BEGIN;\n\n-- Quick Learn 26:' + ql_parts[1]

with open(os.path.join(dir, 'seed_part1_quick_learns_1_to_25.sql'), 'w', encoding='utf-8') as f:
    f.write(ql_part1)
with open(os.path.join(dir, 'seed_part2_quick_learns_26_to_50.sql'), 'w', encoding='utf-8') as f:
    f.write(ql_part2)

qz_parts = qz_sql.split(r'-- Explore Quiz 26:')
qz_part1 = qz_parts[0] + '\nCOMMIT;'
qz_part2 = 'BEGIN;\n\n-- Explore Quiz 26:' + qz_parts[1]

with open(os.path.join(dir, 'seed_part3_quizzes_1_to_25.sql'), 'w', encoding='utf-8') as f:
    f.write(qz_part1)
with open(os.path.join(dir, 'seed_part4_quizzes_26_to_50.sql'), 'w', encoding='utf-8') as f:
    f.write(qz_part2)

print("\n--- 4 MODULAR SQL SEED FILES CREATED ---")
print("Part 1:", round(os.path.getsize(os.path.join(dir, 'seed_part1_quick_learns_1_to_25.sql')) / 1024, 1), "KB")
print("Part 2:", round(os.path.getsize(os.path.join(dir, 'seed_part2_quick_learns_26_to_50.sql')) / 1024, 1), "KB")
print("Part 3:", round(os.path.getsize(os.path.join(dir, 'seed_part3_quizzes_1_to_25.sql')) / 1024, 1), "KB")
print("Part 4:", round(os.path.getsize(os.path.join(dir, 'seed_part4_quizzes_26_to_50.sql')) / 1024, 1), "KB")
