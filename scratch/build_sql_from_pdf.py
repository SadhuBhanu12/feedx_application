import re
import json
import os

with open("scratch/pdf_extracted_text.txt", "r", encoding="utf-8") as f:
    raw_text = f.read()

# Clean page markers and headers
cleaned = re.sub(r'--- PAGE \d+ ---\s*', '', raw_text)
cleaned = re.sub(r'FEEDX Polytechnic Community • Quick Learn & Quiz Content Library\s*', '', cleaned)

# Split Part A and Part B at "PART B — 50 QUIZZES" (or "PART B")
parts = re.split(r'PART B[^\n]*', cleaned, flags=re.IGNORECASE)
part_a_raw = parts[0]
part_b_raw = parts[1] if len(parts) > 1 else ""

print(f"Length Part A raw: {len(part_a_raw)}, Part B raw: {len(part_b_raw)}")

# ==============================================================================
# 1. PARSE PART A: 50 QUICK LEARNS
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
    
    # Learning Text
    learning_match = re.search(r'Learning Text\s*\n([\s\S]*?)(?=Key Points|$)', ql_block, re.IGNORECASE)
    learning_text = learning_match.group(1).strip() if learning_match else ""
    learning_text = re.sub(r'\s+', ' ', learning_text)
    
    # Key Points
    kp_match = re.search(r'Key Points\s*\n([\s\S]*?)(?=15 MCQs|$)', ql_block, re.IGNORECASE)
    kp_text = kp_match.group(1).strip() if kp_match else ""
    key_points = []
    for line in kp_text.split('\n'):
        clean_line = re.sub(r'^[●\s•\-\*]+', '', line).strip()
        if clean_line and clean_line != '●':
            key_points.append(clean_line)
            
    # MCQs
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
            
    quick_learns.append({
        "id": f"00000000-0000-4000-a000-{ql_num:012d}",
        "num": ql_num,
        "title": ql_title,
        "learning_text": learning_text,
        "key_points": key_points,
        "questions": questions
    })

print(f"Quick Learns parsed: {len(quick_learns)}")
total_ql_mcqs = sum(len(ql['questions']) for ql in quick_learns)
print(f"Total Quick Learn MCQs: {total_ql_mcqs}")

# ==============================================================================
# 2. PARSE PART B: 50 QUIZZES
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
            
    quizzes.append({
        "id": f"00000000-0002-4000-a000-{qz_num:012d}",
        "num": qz_num,
        "title": qz_title,
        "questions": questions
    })

print(f"Quizzes parsed: {len(quizzes)}")
total_qz_mcqs = sum(len(qz['questions']) for qz in quizzes)
print(f"Total Quiz MCQs: {total_qz_mcqs}")
