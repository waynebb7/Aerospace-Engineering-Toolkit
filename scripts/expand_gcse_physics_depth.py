from pathlib import Path
import re

base = Path(r'D:/git/engineering/learn/physics/gcse')

extra_blocks = '''
      <div class="card">
        <h2>10) Deep worked examples and unit discipline</h2>
        <p>Advanced GCSE revision should include multi-step worked problems, because most examination losses occur when students can complete short substitutions but struggle once a question combines two equations, a unit conversion, and an interpretation sentence. In this section, practise chaining methods carefully and writing each algebraic stage. Even when values are simple, the discipline of showing full structure improves consistency in longer papers.</p>
        <p>Example workflow: convert units first, then select the equation, then rearrange if needed before substituting. If you substitute too early, errors become harder to spot. For instance, if time is given in minutes and power in watts, convert time to seconds before using <code>E = P x t</code>. If distances are in centimetres and equations expect metres, convert before squaring or dividing so your final unit remains valid.</p>
        <p>Now practise a chained style question. Suppose an appliance transfers 72,000 J in 8 minutes, then runs with 75% efficiency. First convert time: 8 minutes = 480 s. Power input is <code>72,000 / 480 = 150 W</code>. Useful output power is <code>0.75 x 150 = 112.5 W</code>. In a full-mark answer, include both values, both units, and a sentence interpreting the difference as wasted transfer.</p>
        <p>Another multi-step prompt: a moving object has mass 1.2 kg and speed 10 m/s, then slows uniformly to 4 m/s in 3 s. Initial kinetic energy is <code>0.5 x 1.2 x 10^2 = 60 J</code>; final kinetic energy is <code>0.5 x 1.2 x 4^2 = 9.6 J</code>. Energy reduction is 50.4 J. Average acceleration is <code>(4 - 10) / 3 = -2.0 m/s^2</code>. Linking energy and motion in one response shows synoptic control.</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Habit</th><th>Why it gains marks</th></tr>
            </thead>
            <tbody>
              <tr><td>Convert units before substitution</td><td>Prevents hidden arithmetic drift and unit mismatches in final line.</td></tr>
              <tr><td>Rearrange symbolically first</td><td>Makes method clearer and easier to verify under pressure.</td></tr>
              <tr><td>Add interpretation sentence</td><td>Turns raw arithmetic into applied physics reasoning.</td></tr>
              <tr><td>Check significant figures</td><td>Demonstrates precision and avoids overclaiming from approximate data.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <h2>11) Required practical write-up mastery</h2>
        <p>Many GCSE students know practical methods but still underperform because their written evaluation is too generic. To score highly, practical analysis needs to be specific to the setup, instrument limits, and observed trend. Instead of saying "repeat for reliability", say how many repeats were used, how outliers were handled, and whether mean values changed the gradient or conclusion.</p>
        <p>When discussing uncertainty, include both random and systematic ideas. Random uncertainty can be reduced with repeats and averaging. Systematic uncertainty requires method or instrument correction, such as zeroing sensors, calibrating scales, or correcting for heat loss to surroundings. Distinguishing these two types improves quality of evaluation and helps with 6-mark practical responses.</p>
        <p>A robust practical paragraph often follows this structure: (1) identify controlled variables and why they matter, (2) quote one numerical trend from your data, (3) compare data spread to expected model behaviour, and (4) propose one concrete improvement that targets the largest uncertainty source. This is far stronger than listing generic improvements without explanation.</p>
        <div class="two-col">
          <div>
            <h3>High-value control variables</h3>
            <p class="mini">Keep one independent variable changing while maintaining constant geometry, material, initial conditions, and timing method.</p>
            <p class="mini">State explicitly how each control was maintained in practice, not just that it was controlled.</p>
          </div>
          <div>
            <h3>Improvement ideas with rationale</h3>
            <p class="mini">Use data loggers for higher time resolution, insulation to reduce heat exchange, or longer measurement intervals to reduce percentage uncertainty.</p>
            <p class="mini">Always explain which uncertainty source your improvement targets and how it should change the result quality.</p>
          </div>
        </div>
        <div class="warning"><strong>Examiner note:</strong> "Use better equipment" is too vague on its own. Name the equipment and justify the expected impact on reliability or validity.</div>
      </div>

      <div class="card">
        <h2>12) Extended exam technique and response crafting</h2>
        <p>High-band answers in GCSE Physics are concise but logically layered. For "explain" questions, begin with the observed change, then state the mechanism, then reference data or a model equation. For "evaluate" questions, provide at least one strength and one limitation, supported by evidence, before giving a reasoned conclusion. This structure avoids one-sided responses and meets command-word expectations.</p>
        <p>In long questions, avoid writing every fact you know. Select only statements that advance the argument. Use link words such as "therefore", "however", "because", and "as a result" to show reasoning progression. Marker reports consistently show that coherence and relevance separate middle-band and top-band scripts.</p>
        <p>Time management is also a performance skill. Allocate roughly one minute per mark as a starting guide, then reserve a review window. During review, scan for unit omissions, missing negative signs, and conclusions that are not supported by stated evidence. Recovering these routine errors can significantly increase overall paper score.</p>
        <p>To prepare efficiently, practise one complete 6-mark answer per study session. Then rewrite it with three upgrades: one tighter definition, one numerical reference, and one sharper concluding judgement. Rewriting teaches quality faster than repeatedly attempting only short questions.</p>
        <div class="callout"><strong>Final readiness test:</strong> You should be able to define key terms precisely, execute multi-step calculations with units, evaluate practical evidence critically, and produce coherent extended responses under timed conditions.</div>
      </div>
'''

for f in sorted(base.glob('*.html')):
    text = f.read_text(encoding='utf-8')
    if '<h2>10) Deep worked examples and unit discipline</h2>' not in text:
        marker = '\n\n      <p class="page-footer-note">GCSE Physics content.</p>'
        if marker in text:
            text = text.replace(marker, '\n' + extra_blocks + marker)
        else:
            text += '\n' + extra_blocks
    # ensure exactly one footer note line remains
    text = re.sub(r'<p class="page-footer-note">[^<]*</p>', '<p class="page-footer-note">GCSE Physics content.</p>', text)
    f.write_text(text, encoding='utf-8')

print('Expanded cards appended for all GCSE files.')
