# Numora — retro log (append-only)

**Load:** `retro` or failed ship only. Never paste wholesale. Append a **table row**, not a new section.

| Topic | Gotcha | Fix |
|-------|--------|-----|
| Alignment trio | Soul → Birth → Name is not Tri-Identity | Keep Birth × Destiny × Name; tag Soul as Pythagorean vowels and Name as Chaldean |
| Comprehensive vs Enhanced Soul | Same name, two Soul numbers | Comprehensive uses Chaldean vowels (e.g. 10/1); Enhanced/Detailed keep Pythagorean Soul. Do not overwrite snapshot `soul_urge_number`. |
| Mobile Soul | Mobile person chart used Pythagorean Soul | `taggedChartFromPerson` is Chaldean vowels; snapshot/reports stay Pythagorean. 100-point score does not use Soul. |
| Chaldean name engine | Pythagorean vowels still sat on Enhanced/Detailed Soul | Recompute name seats from the stored spelling on open (`applyChaldeanNameLayer`). Expression / Soul / Personality are Chaldean (compound then root). Pythagorean letters are comparison-only. Date seats and the mobile 100-point score stay as they were. |
| Year Resonance | Same Personal Year is not the same experience; Name must not rewrite the date digit | Keep Personal Year date-only. Score Year Resonance from Birth/Name architecture + Name Cycle. Use planetary pair tones, not digit distance. No 0–100 grades; Flow / Growth / Adjustment / High-friction only. |
