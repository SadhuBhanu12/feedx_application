import re
import json

with open("scratch/pdf_extracted_text.txt", "r", encoding="utf-8") as f:
    raw_text = f.read()

# Clean page headers / footers
cleaned = re.sub(r'--- PAGE \d+ ---\s*', '', raw_text)
cleaned = re.sub(r'FEEDX Polytechnic Community • Quick Learn & Quiz Content Library\s*', '', cleaned)

# Split PART A and PART B
parts = re.split(r'PART B — 50 QUIZZES', cleaned)
part_a_text = parts[0]
part_b_text = parts[1] if len(parts) > 1 else ""

# Find Quick Learns in Part A
ql_blocks = re.split(r'Quick Learn (\d{2})\s*—\s*', part_a_text)[1:]

quick_learns = []
for i in range(0, len(ql_blocks), 2):
    ql_num = ql_blocks[i]
    ql_content = ql_blocks[i+1]
    
    # Extract title
    title_match = re.match(r'([^\n]+)', ql_content)
    title = title_match.group(1).strip() if title_match else f"Quick Learn {ql_num}"
    
    # Extract Learning Text
    learning_match = re.search(r'Learning Text\s*\n([\s\S]*?)(?=Key Points|$)', ql_content)
    learning_text = learning_match.group(1).strip() if learning_match else ""
    
    # Extract Key Points
    kp_match = re.search(r'Key Points\s*\n([\s\S]*?)(?=15 MCQs|$)', ql_content)
    kp_text = kp_match.group(1).strip() if kp_match else ""
    key_points = [re.sub(r'^[●\s•\-\*]+', '', line).strip() for line in kp_text.split('\n') if line.strip() and not line.strip().startswith('●')]
    
    # Extract MCQs
    mcqs_match = re.search(r'15 MCQs\s*\n([\s\S]*)', ql_content)
    mcqs_text = mcqs_match.group(1) if mcqs_match else ""
    
    q_blocks = re.split(r'Q(\d+)\.\s*', mcqs_text)[1:]
    questions = []
    for j in range(0, len(q_blocks), 2):
        q_num = q_blocks[j]
        q_body = q_blocks[j+1]
        
        q_text_match = re.match(r'([^\n]+)', q_body)
        q_text = q_text_match.group(1).strip() if q_text_match else ""
        
        opt_a = re.search(r'[●\s•]*A\.\s*([^\n]+)', q_body)
        opt_b = re.search(r'[●\s•]*B\.\s*([^\n]+)', q_body)
        opt_c = re.search(r'[●\s•]*C\.\s*([^\n]+)', q_body)
        opt_d = re.search(r'[●\s•]*D\.\s*([^\n]+)', q_body)
        ans_exp = re.search(r'Answer:\s*([A-D])\s*\|\s*Explanation:\s*([^\n]+)', q_body)
        
        if q_text and opt_a and opt_b and opt_c and opt_d and ans_exp:
            questions.append({
                "question_number": int(q_num),
                "question_text": f"Q{q_num}. {q_text}",
                "option_a": opt_a.group(1).strip(),
                "option_b": opt_b.group(1).strip(),
                "option_c": opt_c.group(1).strip(),
                "option_d": opt_d.group(1).strip(),
                "correct_option": ans_exp.group(1).strip(),
                "explanation": ans_exp.group(2).strip()
            })
            
    quick_learns.append({
        "num": ql_num,
        "title": title,
        "learning_text": learning_text,
        "key_points": key_points,
        "questions_count": len(questions),
        "questions": questions
    })

print(f"Parsed {len(quick_learns)} Quick Learns from Part A!")
for ql in quick_learns[:5]:
    print(f"QL {ql['num']}: {ql['title']} -> {ql['questions_count']} questions")
