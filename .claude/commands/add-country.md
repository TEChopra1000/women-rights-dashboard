Guide the user through adding a new country to the dashboard.

Ask the user which country they want to add. Then research and fill in all required fields following the schema in CLAUDE.md. Work through each policy area:

**Step 1 — Research**
Use web search to find current data for:
- Abortion: legal status, gestational limits, exceptions
- Maternity leave: duration in weeks, % pay, coverage (formal vs informal sector)
- Marriage: minimum age, same-sex recognition status
- Bodily autonomy: contraception access, FGM prevalence/legal status, DV law strength
- Safety: IPV lifetime prevalence % (prefer national survey over WHO regional estimate), key laws

Preferred sources (from CLAUDE.md): CRR abortion map, ILO NORMLEX, OECD Family DB, ILGA World, WHO Violence Against Women (2021), CDC/national surveys.

**Step 2 — Score**
Assign scores (1/2/3) using the methodology in CLAUDE.md. Remember: score reflects real-world access, not just legal text. Note any gap between law-on-paper and actual implementation.

Also determine `maternityBin`:
- 0 = <12 weeks
- 1 = 12–18 weeks  
- 2 = 19–25 weeks
- 3 = 26+ weeks

**Step 3 — Show the user the proposed entry**
Print the full countryData entry and SAFETY_CHART update before writing any code. Ask: "Does this look accurate? Any corrections?"

**Step 4 — Write to script.js**
After user confirms:
1. Insert the new country entry into `countryData` (alphabetical by country name is fine)
2. Add to `SAFETY_CHART.labels` and `SAFETY_CHART.data` — keeping the array sorted high→low by IPV prevalence
3. Read back the relevant sections to verify the edit is syntactically correct

**Step 5 — Verify**
Run a quick sanity check: does the country appear in the dropdown? Are all 5 scores defined? Is `maternityBin` set?
