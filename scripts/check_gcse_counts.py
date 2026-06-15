from pathlib import Path
import re

base = Path(r'D:/git/engineering/learn/physics/gcse')
for f in sorted(base.glob('*.html')):
    t = f.read_text(encoding='utf-8')
    body = re.sub(r'<[^>]+>', ' ', t)
    wc = len(re.findall(r"[A-Za-z0-9'-]+", body))
    has_prog = 'progression-card prerequisites-card' in t
    has_quiz = 'details class="quiz-answers"' in t
    has_footer = 'GCSE Physics content.' in t
    print(f"{f.name}|{wc}|prog={has_prog}|quiz={has_quiz}|footer={has_footer}")
