# Women's Rights Policy Dashboard — Claude Development Guide

## Live site & repo
- **GitHub Pages**: https://techopra1000.github.io/women-rights-dashboard/
- **Repo**: https://github.com/TEChopra1000/women-rights-dashboard
- **Branch**: `main` (Pages deploys from root of main)

## Tech stack
- Vanilla HTML/CSS/JS — no build system, no bundler, no framework
- Chart.js 4.x via CDN (`https://cdn.jsdelivr.net/npm/chart.js`)
- Three files: `index.html`, `styles.css`, `script.js`
- Deploy = `git push origin main`

## Design system (CSS custom properties)
```css
--blue: #007AFF        /* primary action color */
--text: #1d1d1f        /* primary text */
--text-2: #6e6e73      /* secondary/muted text */
--surface: #ffffff
--fill: #f5f5f7        /* page background */
--fill-2: #e8e8ed      /* dividers */
--radius-lg: 24px
--shadow: 0 4px 24px rgba(0,0,0,0.07)
```
Apple aesthetic: pill buttons (`border-radius: 980px`), glassmorphism nav, dark hero gradient, `clamp()` typography, `cubic-bezier(0.25, 0.46, 0.45, 0.94)` transitions.

## Data schema — `countryData` object (script.js)
Each country entry must have exactly these fields:
```js
'Country Name': {
    abortion:     'string description',
    maternity:    'string description',
    marriage:     'string description',
    bodilyRights: 'string description',
    safety:       'string description',
    ipvPrevalence: Number,   // lifetime IPV prevalence % (for safety bar chart)
    scores: {
        abortion:     1|2|3,
        maternity:    1|2|3,
        marriage:     1|2|3,
        bodilyRights: 1|2|3,
        safety:       1|2|3,
        maternityBin: 0|1|2|3  // which bar in maternity chart (see below)
    }
}
```

## Scoring methodology (1–3 scale)
| Score | Label    | Meaning |
|-------|----------|---------|
| 3     | Strong   | Comprehensive legal protections with accessible implementation |
| 2     | Moderate | Legal protections exist but significant limitations or barriers |
| 1     | Limited  | Minimal legal protections or significant restrictions |

**Key nuance**: Score reflects *real-world access*, not just legal text. Example: India's 26-week maternity law scores 2 (not 3) because ~90% of women work in the informal sector and are excluded from coverage.

## Chart architecture

### Abortion chart (`abortionChart`)
Donut chart — 3 segments indexed 0→2:
- Index 0 = score 3 (Strong/broadly legal) → `#34C759`
- Index 1 = score 2 (Moderate/restricted) → `#FF9500`
- Index 2 = score 1 (Limited/banned)      → `#FF3B30`

Country → chart index: `abortionIdx = 3 - d.scores.abortion`

### Maternity chart (`maternityChart`)
Bar chart — 4 bars indexed 0→3 by `maternityBin`:
- 0 = <12 weeks (blue `#007AFF`)
- 1 = 12–18 weeks (blue `#007AFF`)
- 2 = 19–25 weeks (blue `#007AFF`)
- 3 = 26+ weeks (blue `#007AFF`)

Country → chart index: `d.scores.maternityBin`

### Marriage chart (`marriageChart`)
Donut — 3 segments:
- 0 = Full equality → `#5856D6`
- 1 = Partial rights → `#FF2D92`
- 2 = No recognition → `#8E8E93`

Country → chart index: `3 - d.scores.marriage`

### Bodily rights chart (`bodilyRightsChart`)
Donut — 3 segments:
- 0 = Strong → `#5AC8FA`
- 1 = Moderate → `#007AFF`
- 2 = Limited → `#5856D6`

Country → chart index: `3 - d.scores.bodilyRights`

### Safety chart (`safetyChart`)
Horizontal bar chart of IPV lifetime prevalence %. Countries sorted high→low. Not segment-based — country highlighted by matching label in `SAFETY_CHART.labels` array.

Color thresholds:
- ≥35% → `#FF3B30` (red)
- ≥28% → `#FF9500` (orange)
- ≥20% → `#007AFF` (blue)
- <20%  → `#34C759` (green)

## Country explorer (chart highlighting)
- Dropdown populates from `Object.keys(countryData)` in `populateExplorerDropdown()`
- On select: `highlightCountryInCharts(name)` dims non-highlighted segments to 15% opacity using `dimColors(colors, idx)`
- On clear: `clearExplorer()` restores `BASE_COLORS` to all charts
- `hexToRgba(hex, alpha)` converts stored hex colors to rgba for dimming
- Callout chips injected into `.chart-callout` divs appended to each canvas's parent

## Adding a new country (checklist)
1. Add entry to `countryData` with all 8 required fields
2. If `ipvPrevalence` is defined, the country auto-appears in the safety chart — also add to `SAFETY_CHART.labels` and `SAFETY_CHART.data` arrays (keep sorted high→low)
3. Add country to the country grid in `populateCountryGrid()` — it populates automatically from `Object.keys(countryData)`
4. Add to `explorerSelect` dropdown — also automatic
5. Verify scores against the scoring methodology above
6. Source your data — preferred sources listed below

## Preferred data sources
| Policy area | Primary sources |
|-------------|----------------|
| Abortion | Center for Reproductive Rights (reproductiverights.org/maps), WHO fact sheet |
| Maternity leave | ILO NORMLEX, OECD Family Database |
| Marriage rights | ILGA World State-Sponsored Homophobia report, OHCHR CEDAW |
| Bodily autonomy | WHO FGM fact sheet, UN Women, UNFPA State of World Population |
| Safety / IPV | WHO Violence Against Women Prevalence Estimates (2021), national surveys (e.g. CDC NISVS, NFHS-5) |

**IPV data priority**: Use national survey data over WHO regional estimates when available. WHO regional estimates are averages that can mask country-level variation significantly.

## Deployment workflow
```bash
git add index.html styles.css script.js
git commit -m "your message here"
git push origin main
```
Pages typically rebuilds within 1–2 minutes. Check: https://github.com/TEChopra1000/women-rights-dashboard/actions

## Commit style
- Short imperative messages: `add South Korea data`, `fix maternity score for Brazil`
- No co-authorship lines
- Stage specific files, not `git add -A`

## Known limitations / future work
- ~15 countries currently; 195 claimed in hero stats (stat is aspirational)
- Safety chart only shows countries that have IPV prevalence data
- `maternityBin` must be manually set — it's not derived from the text description
- No automated data freshness checks — review annually against source documents
- Mobile chart scrolling works but chart labels can overlap at narrow widths
