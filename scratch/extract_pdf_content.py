import fitz  # PyMuPDF
import sys
import os

pdf_path = "FEEDX_Complete_Quick_Learn_Quiz_Content_Library.pdf"
out_path = "scratch/pdf_extracted_text.txt"

doc = fitz.open(pdf_path)
print(f"Total pages in PDF: {len(doc)}")

full_text = []
for page_num in range(len(doc)):
    page = doc[page_num]
    full_text.append(f"--- PAGE {page_num + 1} ---\n" + page.get_text())

extracted_content = "\n".join(full_text)

os.makedirs("scratch", exist_ok=True)
with open(out_path, "w", encoding="utf-8") as f:
    f.write(extracted_content)

print(f"Successfully extracted {len(extracted_content)} characters ({len(extracted_content.splitlines())} lines) to {out_path}")
