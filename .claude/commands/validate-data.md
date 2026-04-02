Audit the dashboard data for consistency and correctness issues.

Read script.js and run the following checks. Report findings grouped by severity.

**Structural checks**
- Every country in `countryData` has all 8 required fields: abortion, maternity, marriage, bodilyRights, safety, ipvPrevalence, and scores (with all 6 sub-keys: abortion, maternity, marriage, bodilyRights, safety, maternityBin)
- All scores are integers 1, 2, or 3
- All maternityBin values are 0, 1, 2, or 3
- All ipvPrevalence values are numbers between 0 and 100
- Every country in SAFETY_CHART.labels has a matching entry in countryData

**Scoring consistency checks**
Flag potential scoring inconsistencies by looking for:
- Countries where score=3 but the description mentions major restrictions or limited access
- Countries where score=1 but the description sounds broadly positive
- Maternity scores of 3 where the description mentions informal sector exclusions (should probably be 2)
- maternityBin mismatches: e.g. description says "26 weeks" but maternityBin is 1

**Cross-country consistency**
Look for cases where similar policies get different scores. For example:
- Two countries with ~14-16 week maternity leave should have the same maternityBin
- If one country with no same-sex recognition scores marriage=1, all similar countries should too

**SAFETY_CHART consistency**
- Confirm data array is sorted high→low (each value ≤ previous)
- Flag any country whose color threshold doesn't match their value (≥35 red, ≥28 orange, ≥20 blue, <20 green)

**Output format**
For each issue found, print:
```
[SEVERITY] Country: field — issue description
```
Severities: ERROR (missing field/wrong type), WARNING (likely inconsistency), INFO (minor note).

After the audit, summarize: X errors, Y warnings, Z info items found.
