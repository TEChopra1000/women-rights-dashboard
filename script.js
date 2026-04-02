// ── Chart instances (stored so we can highlight segments later) ───────────
const charts = { abortion: null, maternity: null, marriage: null, bodilyRights: null, safety: null, parliament: null, economics: null };

// Original colors for each chart — needed to restore after clearing explorer
const BASE_COLORS = {
    abortion:    ['#34C759', '#FF9500', '#FF3B30'],
    maternity:   ['#007AFF', '#007AFF', '#007AFF', '#007AFF'],
    marriage:    ['#5856D6', '#FF2D92', '#8E8E93'],
    bodilyRights:['#5AC8FA', '#007AFF', '#5856D6']
};

// Safety chart — sorted high → low by IPV prevalence
// Sources: CDC NISVS 2023/24 (US), NFHS-5 2019-21 (India), WHO regional estimates (others)
const SAFETY_CHART = {
    labels: ['Mexico','United States','Nigeria','Australia','Brazil','India','Saudi Arabia','Canada','Sweden','Norway','France','Germany','Poland','Japan','South Korea'],
    data:   [40, 34, 33, 31, 29, 29, 25, 25, 22, 22, 22, 22, 19, 15, 12]
};
SAFETY_CHART.colors = SAFETY_CHART.data.map(v =>
    v >= 35 ? '#FF3B30' : v >= 28 ? '#FF9500' : v >= 20 ? '#007AFF' : '#34C759'
);

// ── Country data ──────────────────────────────────────────────────────────
const countryData = {
    'United States': {
        abortion:    'Varies by state — some have near-total bans following Dobbs v. Jackson (2022)',
        maternity:   '12 weeks unpaid leave (FMLA); 13 states + DC now have paid family leave programs; no federal paid maternity leave',
        marriage:    'Marriage equality legal nationwide since Obergefell v. Hodges (2015)',
        bodilyRights:'Mixed protections, varies significantly by state',
        safety:      'Violence Against Women Act (VAWA) provides federal framework; high gun-related femicide rate; significant state variation in enforcement',
        ipvPrevalence: 34,
        scores: { abortion: 2, maternity: 1, marriage: 3, bodilyRights: 2, safety: 2, maternityBin: 0 }
    },
    'Sweden': {
        abortion:    'Legal up to 18 weeks; later with approval from National Board of Health',
        maternity:   '480 days shared parental leave at ~80% pay',
        marriage:    'Marriage equality legal since 2009',
        bodilyRights:'Strong protections, universal healthcare, and comprehensive services',
        safety:      'Comprehensive domestic violence laws; high reporting rates due to destigmatisation; robust support service network nationwide',
        ipvPrevalence: 22,
        scores: { abortion: 3, maternity: 3, marriage: 3, bodilyRights: 3, safety: 3, maternityBin: 3 }
    },
    'Saudi Arabia': {
        abortion:    'Only permitted to save the mother\'s life',
        maternity:   '10 weeks paid leave (increased from 8 weeks in 2022)',
        marriage:    'Male guardianship system significantly reformed since 2019',
        bodilyRights:'Ongoing Vision 2030 reforms but significant restrictions remain',
        safety:      'Domestic violence law enacted 2013; enforcement limited; significant reforms under Vision 2030 ongoing',
        ipvPrevalence: 25,
        scores: { abortion: 1, maternity: 2, marriage: 1, bodilyRights: 1, safety: 1, maternityBin: 0 }
    },
    'Germany': {
        abortion:    'Legal up to 12 weeks with mandatory counseling; currently under legislative review',
        maternity:   '14 weeks paid maternity leave; up to 3 years parental leave',
        marriage:    'Marriage equality ("Ehe für alle") legal since 2017',
        bodilyRights:'Strong healthcare framework and domestic violence protections',
        safety:      'Istanbul Convention ratified 2018; federal support center network (BIG); strong legal protections against all forms of gender-based violence',
        ipvPrevalence: 22,
        scores: { abortion: 2, maternity: 2, marriage: 3, bodilyRights: 3, safety: 3, maternityBin: 1 }
    },
    'Brazil': {
        abortion:    'Legal only in cases of rape, anencephaly, or risk to the mother\'s life',
        maternity:   '120 days (~17 weeks) paid leave in private sector; 180 days in public sector',
        marriage:    'Marriage equality legal since 2013 (Supreme Court ruling)',
        bodilyRights:'Maria da Penha Law provides domestic violence protections; enforcement uneven',
        safety:      'Maria da Penha Law (2006) is a landmark regional model; femicide classified in 2015; high rates persist with significant regional disparities',
        ipvPrevalence: 29,
        scores: { abortion: 1, maternity: 2, marriage: 3, bodilyRights: 2, safety: 2, maternityBin: 1 }
    },
    'Norway': {
        abortion:    'Legal up to 12 weeks; later with approval up to 18 weeks',
        maternity:   '49 weeks at full pay or 59 weeks at 80% pay (shared parental leave)',
        marriage:    'Marriage equality legal since 2009',
        bodilyRights:'Comprehensive protections, universal healthcare, and robust social services',
        safety:      'Comprehensive legal protections; Action Plan against Domestic Violence; well-funded crisis center network nationwide',
        ipvPrevalence: 22,
        scores: { abortion: 3, maternity: 3, marriage: 3, bodilyRights: 3, safety: 3, maternityBin: 2 }
    },
    'Japan': {
        abortion:    'Legal with spousal consent in most cases; abortion pill (mifepristone) approved in 2023',
        maternity:   '14 weeks paid maternity leave; generous additional parental leave available',
        marriage:    'No national same-sex marriage; local partnership certificates in many cities',
        bodilyRights:'Good healthcare access; cultural barriers to reporting domestic violence persist',
        safety:      'DV Prevention Law (2001, amended multiple times); significant underreporting due to cultural stigma; awareness campaigns improving',
        ipvPrevalence: 15,
        scores: { abortion: 2, maternity: 2, marriage: 1, bodilyRights: 2, safety: 2, maternityBin: 1 }
    },
    'Canada': {
        abortion:    'Legal with no gestational limit and publicly funded under most provincial health plans',
        maternity:   '15 weeks maternity benefit plus up to 40 weeks parental benefit (EI)',
        marriage:    'Marriage equality legal since 2005 (first G7 country)',
        bodilyRights:'Strong legal protections and universal healthcare system',
        safety:      'Strong federal and provincial protections; National Action Plan to End Gender-Based Violence (2022); ongoing gaps in services for Indigenous women',
        ipvPrevalence: 25,
        scores: { abortion: 3, maternity: 3, marriage: 3, bodilyRights: 3, safety: 3, maternityBin: 3 }
    },
    'India': {
        abortion:    'Legal up to 24 weeks with conditions under MTP Amendment Act (2021)',
        maternity:   '26 weeks paid leave on paper (Maternity Benefit Amendment 2017), but only covers ~4% of female workforce — ~90% of women work in the informal sector and are excluded',
        marriage:    'Legal minimum age 18 for women; child marriage prohibition enforced inconsistently',
        bodilyRights:'Laws exist but enforcement varies widely; high rates of gender-based violence',
        safety:      'Protection of Women from Domestic Violence Act (2005); enforcement and awareness vary widely across states and rural areas',
        ipvPrevalence: 29,
        scores: { abortion: 2, maternity: 2, marriage: 2, bodilyRights: 2, safety: 2, maternityBin: 1 }
    },
    'Nigeria': {
        abortion:    'Only permitted to save the mother\'s life under federal law',
        maternity:   '12 weeks paid leave in federal civil service; private sector often less',
        marriage:    'Child marriage still prevalent; polygamy legal under customary law',
        bodilyRights:'Limited legal protections; high rates of gender-based violence and FGM',
        safety:      'Violence Against Persons Prohibition Act (2015); not adopted in all states; weak enforcement and high rates of gender-based violence',
        ipvPrevalence: 33,
        scores: { abortion: 1, maternity: 2, marriage: 1, bodilyRights: 1, safety: 1, maternityBin: 0 }
    },
    'France': {
        abortion:    'Legal up to 14 weeks (extended in 2022); right enshrined in the constitution in 2024',
        maternity:   '16 weeks paid maternity leave (26 weeks from 3rd child)',
        marriage:    'Marriage equality ("Mariage pour tous") legal since 2013',
        bodilyRights:'Strong legal framework; constitution now guarantees freedom to terminate pregnancy',
        safety:      'Grenelle du Féminicide (2019); mandatory DV training for police; strong legal framework with high reporting rates',
        ipvPrevalence: 22,
        scores: { abortion: 3, maternity: 2, marriage: 3, bodilyRights: 3, safety: 3, maternityBin: 1 }
    },
    'Australia': {
        abortion:    'Legal in all states; gestational limits and provider availability vary by state',
        maternity:   '18 weeks government-paid parental leave (increasing to 26 weeks by 2026)',
        marriage:    'Marriage equality legal since 2017',
        bodilyRights:'Strong protections; Medicare provides broad healthcare coverage',
        safety:      'National Plan to End Violence Against Women 2022–2032; Indigenous women face significantly higher rates of violence',
        ipvPrevalence: 31,
        scores: { abortion: 3, maternity: 2, marriage: 3, bodilyRights: 3, safety: 3, maternityBin: 1 }
    },
    'Poland': {
        abortion:    'Near-total ban since 2021 Constitutional Tribunal ruling; new government seeking reform',
        maternity:   '20 weeks paid maternity leave',
        marriage:    'No same-sex marriage or civil unions at national level',
        bodilyRights:'Conservative policies significantly restrict reproductive and bodily autonomy',
        safety:      'Istanbul Convention ratified but government threatened withdrawal (2020); rollbacks concern advocates; strong Catholic Church influence on policy',
        ipvPrevalence: 19,
        scores: { abortion: 1, maternity: 2, marriage: 1, bodilyRights: 1, safety: 2, maternityBin: 1 }
    },
    'Mexico': {
        abortion:    'Federally decriminalized by Supreme Court in September 2023; legal in all 32 states',
        maternity:   '12 weeks paid maternity leave',
        marriage:    'Same-sex marriage legal in all 32 states since 2022',
        bodilyRights:'Femicide classified as a crime in all states; implementation remains inconsistent',
        safety:      'Femicide codified in all states; National Emergency Alert System for Gender Violence; high impunity rates persist despite strong legal framework',
        ipvPrevalence: 40,
        scores: { abortion: 3, maternity: 2, marriage: 3, bodilyRights: 2, safety: 2, maternityBin: 0 }
    },
    'South Korea': {
        abortion:    'Decriminalized since January 2021 after Constitutional Court ruling; no replacement law enacted',
        maternity:   '90 days paid maternity leave',
        marriage:    'No same-sex marriage; Constitutional Court rulings on equal rights pending',
        bodilyRights:'Modern healthcare infrastructure; underreporting of domestic violence remains high',
        safety:      'Act on Prevention of Domestic Violence (1997); declining IPV trend from 2010–2022; cultural stigma still limits reporting significantly',
        ipvPrevalence: 12,
        scores: { abortion: 2, maternity: 2, marriage: 1, bodilyRights: 2, safety: 2, maternityBin: 1 }
    }
};

// ── Global chart/sample data ──────────────────────────────────────────────
const sampleData = {
    abortion:    { legal: 67, restricted: 89, illegal: 39 },
    maternity:   { '0-12weeks': 15, '13-26weeks': 45, '27-52weeks': 85, '52+weeks': 50 },
    marriage:    { equal: 120, restricted: 45, discriminatory: 30 },
    bodilyRights:{ strong: 78, moderate: 67, weak: 50 }
};

// ── All 195 countries ─────────────────────────────────────────────────────
const allCountries = [
    'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda',
    'Argentina','Armenia','Australia','Austria','Azerbaijan','Bahamas','Bahrain',
    'Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan',
    'Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria',
    'Burkina Faso','Burundi','Cabo Verde','Cambodia','Cameroon','Canada',
    'Central African Republic','Chad','Chile','China','Colombia','Comoros',
    'Congo (Brazzaville)','Congo (Kinshasa)','Costa Rica','Croatia','Cuba',
    'Cyprus','Czech Republic','Denmark','Djibouti','Dominica','Dominican Republic',
    'Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia',
    'Eswatini','Ethiopia','Fiji','Finland','France','Gabon','Gambia',
    'Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea',
    'Guinea-Bissau','Guyana','Haiti','Honduras','Hungary','Iceland','India',
    'Indonesia','Iran','Iraq','Ireland','Israel','Italy','Jamaica',
    'Japan','Jordan','Kazakhstan','Kenya','Kiribati','Kuwait','Kyrgyzstan',
    'Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein',
    'Lithuania','Luxembourg','Madagascar','Malawi','Malaysia','Maldives',
    'Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico',
    'Micronesia','Moldova','Monaco','Mongolia','Montenegro','Morocco',
    'Mozambique','Myanmar','Namibia','Nauru','Nepal','Netherlands',
    'New Zealand','Nicaragua','Niger','Nigeria','North Korea','North Macedonia',
    'Norway','Oman','Pakistan','Palau','Palestine','Panama','Papua New Guinea',
    'Paraguay','Peru','Philippines','Poland','Portugal','Qatar','Romania',
    'Russia','Rwanda','Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines',
    'Samoa','San Marino','Sao Tome and Principe','Saudi Arabia','Senegal',
    'Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia',
    'Solomon Islands','Somalia','South Africa','South Korea','South Sudan',
    'Spain','Sri Lanka','Sudan','Suriname','Sweden','Switzerland','Syria',
    'Taiwan','Tajikistan','Tanzania','Thailand','Timor-Leste','Togo',
    'Tonga','Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu',
    'Uganda','Ukraine','United Arab Emirates','United Kingdom','United States',
    'Uruguay','Uzbekistan','Vanuatu','Vatican City','Venezuela','Vietnam',
    'Yemen','Zambia','Zimbabwe'
];

let selectedCountries = [];
let comparisonChart = null;

// ── Verification data (US + Sweden have full detail) ──────────────────────
const verificationData = {
    'United States': {
        abortion: {
            status: 'Moderate', score: 2,
            description: 'Varies by state — some states have near-total bans following Dobbs (2022)',
            rationale: 'Score of 2 reflects significant state-by-state variation. Over 20 states enacted restrictions or near-total bans since Dobbs, while others have codified or expanded access.',
            sources: [
                { title: 'Guttmacher Institute — State Abortion Policy Overview', url: 'https://www.guttmacher.org/state-policy/explore/overview-abortion-laws' },
                { title: 'Center for Reproductive Rights — After Roe Fell', url: 'https://reproductiverights.org/maps/abortion-worldwide/' },
                { title: 'KFF — Abortion in the US', url: 'https://www.kff.org/womens-health-policy/issue-brief/abortion-in-the-united-states/' }
            ]
        },
        maternity: {
            status: 'Limited', score: 1,
            description: '12 weeks unpaid leave (FMLA); no federal paid maternity leave — 13 states + DC now have paid programs',
            rationale: 'Score of 1 reflects the absence of federal paid parental leave. FMLA excludes ~44% of workers, and 95% of the lowest-wage workers have no access to paid leave at all. State programs are growing but coverage remains deeply unequal.',
            sources: [
                { title: 'US Department of Labor — FMLA Overview', url: 'https://www.dol.gov/agencies/whd/fmla' },
                { title: 'OECD — Parental Leave Policy Indicators', url: 'https://www.oecd.org/en/topics/sub-issues/parental-leave.html' },
                { title: 'National Partnership for Women & Families — Paid Leave', url: 'https://www.nationalpartnership.org/our-work/resources/economic-justice/paid-leave/' }
            ]
        },
        marriage: {
            status: 'Strong', score: 3,
            description: 'Marriage equality since Obergefell v. Hodges (2015); further protected by Respect for Marriage Act (2022)',
            rationale: 'Score of 3 for federal marriage equality and bipartisan Respect for Marriage Act, which provides federal statutory protection regardless of future Supreme Court decisions.',
            sources: [
                { title: 'Supreme Court — Obergefell v. Hodges (2015)', url: 'https://www.supremecourt.gov/opinions/14pdf/14-556_3204.pdf' },
                { title: 'Human Rights Campaign — Marriage Equality', url: 'https://www.hrc.org/resources/marriage-equality' },
                { title: 'Congress.gov — Respect for Marriage Act', url: 'https://www.congress.gov/bill/117th-congress/house-bill/8404' }
            ]
        },
        bodilyRights: {
            status: 'Moderate', score: 2,
            description: 'Mixed protections; contraception access, DV laws, and healthcare rights vary by state',
            rationale: 'Score of 2 reflects strong federal baseline protections alongside significant state-level variation in contraception access and VAWA implementation.',
            sources: [
                { title: 'National Domestic Violence Hotline — Legal Resources', url: 'https://www.thehotline.org/resources/legal-help/' },
                { title: 'Guttmacher — Contraceptive Insurance Coverage', url: 'https://www.guttmacher.org/state-policy/explore/insurance-coverage-contraceptives' },
                { title: 'ACLU — Reproductive Freedom', url: 'https://www.aclu.org/issues/reproductive-freedom' }
            ]
        },
        safety: {
            status: 'Moderate', score: 2,
            description: '34% lifetime IPV prevalence (CDC NISVS 2023/24); VAWA framework; high gun-related femicide rate',
            rationale: 'Score of 2 for strong federal VAWA framework (reauthorized 2022), partially offset by one of the highest femicide rates among high-income countries, heavily linked to firearms access.',
            sources: [
                { title: 'CDC NISVS — Intimate Partner Violence Data Brief (2023/24)', url: 'https://www.cdc.gov/nisvs/media/pdfs/intimatepartnerviolence-brief.pdf' },
                { title: 'Everytown Research — Guns and Violence Against Women', url: 'https://everytownresearch.org/report/guns-and-violence-against-women/' },
                { title: 'Georgetown WPS Index', url: 'https://giwps.georgetown.edu/the-index/' }
            ]
        }
    },
    'Sweden': {
        abortion: {
            status: 'Strong', score: 3,
            description: 'Legal up to 18 weeks; publicly funded and accessible through universal healthcare',
            rationale: 'Score of 3 for broad legal access, full public funding, short waiting times, and a healthcare system that prioritises access without stigma.',
            sources: [
                { title: 'Swedish National Board of Health and Welfare — Abortion Statistics', url: 'https://www.socialstyrelsen.se/en/statistics-and-data/statistics/statistical-topics/abortions/' },
                { title: 'European Parliament — Abortion Rights in EU Member States', url: 'https://www.europarl.europa.eu/topics/en/article/20220627STO33490/abortion-rights-where-do-eu-countries-stand' },
                { title: 'WHO Europe — Sexual and Reproductive Health', url: 'https://www.who.int/europe/health-topics/sexual-and-reproductive-health' }
            ]
        },
        maternity: {
            status: 'Strong', score: 3,
            description: '480 days shared parental leave at ~80% pay — one of the world\'s most generous systems',
            rationale: 'Score of 3 for generous duration, high wage replacement, and the daddy quota that encourages fathers to share leave.',
            sources: [
                { title: 'Swedish Social Insurance Agency — Parental Benefit', url: 'https://www.forsakringskassan.se/english/parents/parental-benefit' },
                { title: 'OECD — Parental Leave Policies: Sweden', url: 'https://www.oecd.org/en/topics/sub-issues/parental-leave.html' },
                { title: 'European Commission — Work-Life Balance Directive', url: 'https://ec.europa.eu/social/main.jsp?catId=1311&langId=en' }
            ]
        },
        marriage: {
            status: 'Strong', score: 3,
            description: 'Marriage equality legal since 2009; comprehensive anti-discrimination protections',
            rationale: 'Score of 3 for early adoption of marriage equality and top-ranked LGBTQ+ protections per ILGA-Europe.',
            sources: [
                { title: 'ILGA-Europe — Rainbow Map 2024', url: 'https://www.ilga-europe.org/rainbowmap/' },
                { title: 'Swedish Federation for LGBTQ Rights (RFSL)', url: 'https://www.rfsl.se/en/' },
                { title: 'Swedish Government — Democracy and Human Rights', url: 'https://www.government.se/government-policy/democracy-and-human-rights/' }
            ]
        },
        bodilyRights: {
            status: 'Strong', score: 3,
            description: 'Comprehensive healthcare, strong DV laws, and robust bodily autonomy protections',
            rationale: 'Score of 3 for universal healthcare access, the landmark Sex Purchase Act (1999), comprehensive DV services, and strong FGM prohibitions.',
            sources: [
                { title: 'Swedish National Board of Health and Welfare', url: 'https://www.socialstyrelsen.se/en/' },
                { title: 'Council of Europe — Istanbul Convention: Sweden', url: 'https://www.coe.int/en/web/istanbul-convention' },
                { title: 'UN Women — Sweden Country Profile', url: 'https://www.unwomen.org/en/where-we-are/europe-and-central-asia/sweden' }
            ]
        },
        safety: {
            status: 'Strong', score: 3,
            description: '22% lifetime IPV prevalence; comprehensive DV legal framework; high reporting rates',
            rationale: 'Score of 3 for the comprehensive Sex Purchase Act, well-funded shelter network, destigmatisation campaigns, and consistent high performance in the Georgetown WPS Index.',
            sources: [
                { title: 'NCK — National Centre for Knowledge on Men\'s Violence Against Women', url: 'https://nck.uu.se/en/' },
                { title: 'Council of Europe — Istanbul Convention: Sweden', url: 'https://www.coe.int/en/web/istanbul-convention' },
                { title: 'Georgetown WPS Index — Sweden', url: 'https://giwps.georgetown.edu/the-index/' }
            ]
        }
    }
};

// ── Init ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    initializeCharts();
    setupSmoothScrolling();
    initializeCountryComparison();
    initializeVerificationTool();
    initializeExplorer();
    setupHamburgerMenu();
    setupScrollAnimations();
    setupActiveNav();
    animateCounters();

    document.getElementById('countrySearch').addEventListener('keypress', e => {
        if (e.key === 'Enter') searchCountry();
    });

    document.getElementById('rankInput').addEventListener('keypress', e => {
        if (e.key === 'Enter') rankCountry();
    });

    initParliamentChart();
    initEconomicChart();
    initChoroplethMap();
});

// ── Hamburger ─────────────────────────────────────────────────────────────
function setupHamburgerMenu() {
    const btn = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');

    btn.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        btn.classList.toggle('open', isOpen);
        btn.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            btn.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
        });
    });

    document.addEventListener('click', e => {
        if (!btn.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('open');
            btn.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
        }
    });
}

// ── Active nav ────────────────────────────────────────────────────────────
function setupActiveNav() {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(l => l.classList.remove('active'));
                const a = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
                if (a) a.classList.add('active');
            }
        });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(s => obs.observe(s));
}

// ── Scroll animations ─────────────────────────────────────────────────────
function setupScrollAnimations() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => obs.observe(el));
}

// ── Animated counters ─────────────────────────────────────────────────────
function animateCounters() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            obs.unobserve(entry.target);
            const target = parseInt(entry.target.dataset.target, 10);
            const start = performance.now();
            const duration = 1200;
            const tick = now => {
                const p = Math.min((now - start) / duration, 1);
                entry.target.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-number[data-target]').forEach(el => obs.observe(el));
}

// ── Smooth scrolling ──────────────────────────────────────────────────────
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const t = document.querySelector(a.getAttribute('href'));
            if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// ── Charts ────────────────────────────────────────────────────────────────
function initializeCharts() {
    charts.abortion = new Chart(
        document.getElementById('abortionChart').getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Legal / Accessible', 'Restricted', 'Illegal / Banned'],
                datasets: [{ data: [67, 89, 39], backgroundColor: [...BASE_COLORS.abortion], borderWidth: 2, borderColor: '#fff' }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true } },
                    title: { display: true, text: 'Global Abortion Rights Status', font: { size: 15, weight: '600' } }
                }
            }
        }
    );

    charts.maternity = new Chart(
        document.getElementById('maternityChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['0–12 weeks', '13–26 weeks', '27–52 weeks', '52+ weeks'],
                datasets: [{ label: 'Number of Countries', data: [15, 45, 85, 50], backgroundColor: [...BASE_COLORS.maternity], borderWidth: 0 }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Maternity Leave Duration by Country', font: { size: 15, weight: '600' } }
                },
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'Number of Countries' } },
                    x: { title: { display: true, text: 'Leave Duration' } }
                }
            }
        }
    );

    charts.marriage = new Chart(
        document.getElementById('marriageChart').getContext('2d'), {
            type: 'pie',
            data: {
                labels: ['Equal Rights', 'Some Restrictions', 'Discriminatory Laws'],
                datasets: [{ data: [120, 45, 30], backgroundColor: [...BASE_COLORS.marriage], borderWidth: 2, borderColor: '#fff' }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true } },
                    title: { display: true, text: 'Marriage Rights Equality', font: { size: 15, weight: '600' } }
                }
            }
        }
    );

    charts.bodilyRights = new Chart(
        document.getElementById('bodilyRightsChart').getContext('2d'), {
            type: 'polarArea',
            data: {
                labels: ['Strong Protections', 'Moderate Protections', 'Weak Protections'],
                datasets: [{ data: [78, 67, 50], backgroundColor: [...BASE_COLORS.bodilyRights], borderWidth: 2, borderColor: '#fff' }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true } },
                    title: { display: true, text: 'Bodily Autonomy Rights', font: { size: 15, weight: '600' } }
                }
            }
        }
    );

    charts.safety = new Chart(
        document.getElementById('safetyChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: SAFETY_CHART.labels,
                datasets: [{
                    label: 'Lifetime IPV Prevalence (%)',
                    data: SAFETY_CHART.data,
                    backgroundColor: [...SAFETY_CHART.colors],
                    borderWidth: 0,
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Intimate Partner Violence — Lifetime Prevalence (%)', font: { size: 15, weight: '600' } },
                    tooltip: { callbacks: { label: ctx => ` ${ctx.raw}% lifetime prevalence` } }
                },
                scales: {
                    x: {
                        beginAtZero: true, max: 50,
                        title: { display: true, text: 'Lifetime IPV Prevalence (%)' },
                        ticks: { callback: v => v + '%' }
                    }
                }
            }
        }
    );

    // Inject callout divs into each chart container
    [
        { canvasId: 'abortionChart',     calloutId: 'callout-abortion' },
        { canvasId: 'maternityChart',    calloutId: 'callout-maternity' },
        { canvasId: 'marriageChart',     calloutId: 'callout-marriage' },
        { canvasId: 'bodilyRightsChart', calloutId: 'callout-bodilyRights' },
        { canvasId: 'safetyChart',       calloutId: 'callout-safety' }
    ].forEach(({ canvasId, calloutId }) => {
        const div = document.createElement('div');
        div.className = 'chart-callout';
        div.id = calloutId;
        div.style.display = 'none';
        document.getElementById(canvasId).parentElement.appendChild(div);
    });
}

// ── Country Explorer ──────────────────────────────────────────────────────
function initializeExplorer() {
    const sel = document.getElementById('explorerSelect');
    Object.keys(countryData).forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        sel.appendChild(opt);
    });
    sel.addEventListener('change', () => {
        if (sel.value) {
            highlightCountryInCharts(sel.value);
            document.getElementById('explorerClearBtn').style.display = '';
        } else {
            clearExplorer();
        }
    });
}

function clearExplorer() {
    document.getElementById('explorerSelect').value = '';
    document.getElementById('explorerClearBtn').style.display = 'none';
    restoreAllCharts();
    document.querySelectorAll('.chart-callout').forEach(el => { el.style.display = 'none'; });
}

// ── Highlight logic ───────────────────────────────────────────────────────

/** Convert '#rrggbb' to 'rgba(r,g,b,a)' */
function hexToRgba(hex, alpha) {
    const n = parseInt(hex.replace('#', ''), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

/** Return new color array with all except highlightIdx dimmed */
function dimColors(colors, highlightIdx) {
    return colors.map((c, i) => i === highlightIdx ? c : hexToRgba(c, 0.15));
}

function restoreAllCharts() {
    if (charts.abortion)     { charts.abortion.data.datasets[0].backgroundColor = [...BASE_COLORS.abortion];     charts.abortion.update('none'); }
    if (charts.maternity)    { charts.maternity.data.datasets[0].backgroundColor = [...BASE_COLORS.maternity];    charts.maternity.update('none'); }
    if (charts.marriage)     { charts.marriage.data.datasets[0].backgroundColor = [...BASE_COLORS.marriage];     charts.marriage.update('none'); }
    if (charts.bodilyRights) { charts.bodilyRights.data.datasets[0].backgroundColor = [...BASE_COLORS.bodilyRights]; charts.bodilyRights.update('none'); }
    if (charts.safety)       { charts.safety.data.datasets[0].backgroundColor = [...SAFETY_CHART.colors];        charts.safety.update('none'); }
}

function showCallout(id, country, category, statusClass, note) {
    const el = document.getElementById(`callout-${id}`);
    if (!el) return;
    el.style.display = 'flex';
    el.innerHTML = `
        <span class="callout-country">${country}</span>
        <span class="callout-arrow">→</span>
        <span class="policy-status ${statusClass}">${category}</span>
        ${note ? `<span class="callout-note">${note}</span>` : ''}
    `;
}

function scoreToStatusClass(score) {
    return score === 3 ? 'status-strong' : score === 2 ? 'status-moderate' : 'status-weak';
}

function highlightCountryInCharts(countryName) {
    const d = countryData[countryName];
    if (!d) return;

    // ── Abortion (doughnut) — score 3→idx 0, 2→1, 1→2
    const abortionIdx = 3 - d.scores.abortion;
    const abortionLabels = ['Legal / Accessible', 'Restricted', 'Illegal / Banned'];
    charts.abortion.data.datasets[0].backgroundColor = dimColors(BASE_COLORS.abortion, abortionIdx);
    charts.abortion.update('none');
    showCallout('abortion', countryName, abortionLabels[abortionIdx], scoreToStatusClass(d.scores.abortion));

    // ── Maternity (bar) — maternityBin 0–3
    const matBin = d.scores.maternityBin;
    const matLabels = ['0–12 weeks', '13–26 weeks', '27–52 weeks', '52+ weeks'];
    charts.maternity.data.datasets[0].backgroundColor = dimColors(BASE_COLORS.maternity, matBin);
    charts.maternity.update('none');
    showCallout('maternity', countryName, matLabels[matBin], scoreToStatusClass(d.scores.maternity));

    // ── Marriage (pie) — score 3→0, 2→1, 1→2
    const marriageIdx = 3 - d.scores.marriage;
    const marriageLabels = ['Equal Rights', 'Some Restrictions', 'Discriminatory Laws'];
    charts.marriage.data.datasets[0].backgroundColor = dimColors(BASE_COLORS.marriage, marriageIdx);
    charts.marriage.update('none');
    showCallout('marriage', countryName, marriageLabels[marriageIdx], scoreToStatusClass(d.scores.marriage));

    // ── Bodily Rights (polar) — score 3→0, 2→1, 1→2
    const bodilyIdx = 3 - d.scores.bodilyRights;
    const bodilyLabels = ['Strong Protections', 'Moderate Protections', 'Weak Protections'];
    charts.bodilyRights.data.datasets[0].backgroundColor = dimColors(BASE_COLORS.bodilyRights, bodilyIdx);
    charts.bodilyRights.update('none');
    showCallout('bodilyRights', countryName, bodilyLabels[bodilyIdx], scoreToStatusClass(d.scores.bodilyRights));

    // ── Safety (horizontal bar) — find country in sorted labels
    const safetyIdx = SAFETY_CHART.labels.indexOf(countryName);
    if (safetyIdx !== -1) {
        charts.safety.data.datasets[0].backgroundColor = dimColors(SAFETY_CHART.colors, safetyIdx);
        charts.safety.update('none');
        const prevalence = d.ipvPrevalence;
        const safetyStatus = prevalence >= 35 ? 'status-weak' : prevalence >= 25 ? 'status-moderate' : 'status-strong';
        const safetyLabel = prevalence >= 35 ? 'High prevalence' : prevalence >= 25 ? 'Elevated prevalence' : 'Lower prevalence';
        showCallout('safety', countryName, safetyLabel, safetyStatus, `${prevalence}% lifetime IPV (WHO/national survey)`);
    } else {
        // Country not in safety chart — show note
        const el = document.getElementById('callout-safety');
        if (el) {
            el.style.display = 'flex';
            el.innerHTML = `<span class="callout-note">No country-level IPV data available for ${countryName}</span>`;
        }
    }
}

// ── Country search ────────────────────────────────────────────────────────
function searchCountry() {
    const term = document.getElementById('countrySearch').value.trim();
    const out  = document.getElementById('countryResults');
    if (!term) { out.innerHTML = '<p>Please enter a country name to search.</p>'; return; }

    const key = Object.keys(countryData).find(c => c.toLowerCase().includes(term.toLowerCase()));

    if (key) {
        const d = countryData[key];
        const ex = countryExtras[key] || {};
        const trendBadge = ex.trend ? buildTrendBadge(ex.trend) : '';
        const enfBadge   = ex.enforcementGap
            ? `<span class="badge badge-enforcement">⚠ Law vs. Enforcement Gap</span>`
            : '';
        out.innerHTML = `
            <h3>${key}</h3>
            ${(trendBadge || enfBadge) ? `<div class="badge-row">${trendBadge}${enfBadge}</div>` : ''}
            <div class="country-info">
                <div class="info-section"><h4>🏥 Abortion Rights</h4><p>${d.abortion}</p></div>
                <div class="info-section"><h4>👶 Maternity Leave</h4><p>${d.maternity}</p></div>
                <div class="info-section"><h4>💍 Marriage Rights</h4><p>${d.marriage}</p></div>
                <div class="info-section"><h4>⚖️ Bodily Autonomy</h4><p>${d.bodilyRights}</p></div>
                <div class="info-section"><h4>🛡️ Women's Safety</h4><p>${d.safety}</p></div>
            </div>`;
    } else {
        const btns = Object.keys(countryData)
            .map(c => `<li><button class="suggestion-btn" onclick="selectSuggestion('${c}')">${c}</button></li>`)
            .join('');
        out.innerHTML = `
            <div style="text-align:center;padding:2rem">
                <h3>Country Not Found</h3>
                <p>No data for "${term}". Try one of these:</p>
                <ul style="list-style:none;padding:0;margin-top:1rem;display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center">${btns}</ul>
            </div>`;
    }
}

function selectSuggestion(c) {
    document.getElementById('countrySearch').value = c;
    searchCountry();
}

// ── Country comparison ────────────────────────────────────────────────────
function initializeCountryComparison() {
    const grid = document.getElementById('countryGrid');
    Object.keys(countryData).forEach(country => {
        const card = document.createElement('div');
        card.className = 'country-card';
        card.textContent = country;
        card.onclick = () => toggleCountrySelection(country, card);
        grid.appendChild(card);
    });
}

function toggleCountrySelection(country, el) {
    if (el.classList.contains('disabled')) return;
    const already = selectedCountries.includes(country);
    if (already) {
        selectedCountries = selectedCountries.filter(c => c !== country);
        el.classList.remove('selected');
        if (selectedCountries.length < 10)
            document.querySelectorAll('.country-card.disabled').forEach(c => c.classList.remove('disabled'));
    } else if (selectedCountries.length < 10) {
        selectedCountries.push(country);
        el.classList.add('selected');
        if (selectedCountries.length === 10)
            document.querySelectorAll('.country-card:not(.selected)').forEach(c => c.classList.add('disabled'));
    }
    updateSelectionUI();
}

function updateSelectionUI() {
    document.getElementById('selectedCount').textContent = `${selectedCountries.length}/10 selected`;
    document.getElementById('compareButton').disabled = selectedCountries.length < 2;
}

function clearSelection() {
    selectedCountries = [];
    document.querySelectorAll('.country-card').forEach(c => c.classList.remove('selected', 'disabled'));
    updateSelectionUI();
    hideComparison();
}

function generateComparison() {
    if (selectedCountries.length < 2) return;
    const el = document.getElementById('comparisonResults');
    el.style.display = 'block';
    generateComparisonTable();
    generateComparisonChart();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function generateComparisonTable() {
    const body = document.getElementById('comparisonTableBody');
    body.innerHTML = '';
    const map = {
        1: { cls: 'status-weak', text: 'Limited' },
        2: { cls: 'status-moderate', text: 'Moderate' },
        3: { cls: 'status-strong', text: 'Strong' }
    };
    selectedCountries.forEach(country => {
        const d = countryData[country];
        const s = d.scores;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="country-name">${country}</td>
            <td><div class="policy-status ${map[s.abortion].cls}">${map[s.abortion].text}</div><div style="margin-top:.4rem;font-size:.82rem">${d.abortion}</div></td>
            <td><div class="policy-status ${map[s.maternity].cls}">${map[s.maternity].text}</div><div style="margin-top:.4rem;font-size:.82rem">${d.maternity}</div></td>
            <td><div class="policy-status ${map[s.marriage].cls}">${map[s.marriage].text}</div><div style="margin-top:.4rem;font-size:.82rem">${d.marriage}</div></td>
            <td><div class="policy-status ${map[s.bodilyRights].cls}">${map[s.bodilyRights].text}</div><div style="margin-top:.4rem;font-size:.82rem">${d.bodilyRights}</div></td>
            <td><div class="policy-status ${map[s.safety].cls}">${map[s.safety].text}</div><div style="margin-top:.4rem;font-size:.82rem">${d.ipvPrevalence}% lifetime IPV</div></td>
        `;
        body.appendChild(row);
    });
}

function generateComparisonChart() {
    const ctx = document.getElementById('comparisonChart').getContext('2d');
    if (comparisonChart) comparisonChart.destroy();
    comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: selectedCountries,
            datasets: [
                { label: 'Abortion Rights', data: selectedCountries.map(c => countryData[c].scores.abortion), backgroundColor: '#34C759', borderWidth: 0 },
                { label: 'Maternity Leave', data: selectedCountries.map(c => countryData[c].scores.maternity), backgroundColor: '#007AFF', borderWidth: 0 },
                { label: 'Marriage Rights', data: selectedCountries.map(c => countryData[c].scores.marriage), backgroundColor: '#5856D6', borderWidth: 0 },
                { label: 'Bodily Autonomy', data: selectedCountries.map(c => countryData[c].scores.bodilyRights), backgroundColor: '#FF9500', borderWidth: 0 },
                { label: "Women's Safety", data: selectedCountries.map(c => countryData[c].scores.safety), backgroundColor: '#FF2D92', borderWidth: 0 }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: "Women's Rights Policy Comparison", font: { size: 15, weight: '600' } },
                legend: { position: 'top', labels: { padding: 16, usePointStyle: true } }
            },
            scales: {
                y: {
                    beginAtZero: true, max: 3,
                    ticks: { stepSize: 1, callback: v => ({ 0: 'None', 1: 'Limited', 2: 'Moderate', 3: 'Strong' }[v] ?? v) },
                    title: { display: true, text: 'Policy Strength' }
                },
                x: { title: { display: true, text: 'Countries' } }
            },
            interaction: { intersect: false, mode: 'index' }
        }
    });
}

function showTab(event, tabName) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
    document.getElementById(tabName + 'View').classList.add('active');
    event.target.classList.add('active');
}

function hideComparison() {
    document.getElementById('comparisonResults').style.display = 'none';
}

// ── Verification tool ─────────────────────────────────────────────────────
function initializeVerificationTool() {
    const sel = document.getElementById('countrySelect');
    allCountries.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c; opt.textContent = c;
        sel.appendChild(opt);
    });
    sel.addEventListener('change', () => {
        document.getElementById('lookupButton').disabled = !sel.value;
    });
}

function lookupCountry() {
    const country = document.getElementById('countrySelect').value;
    if (!country) return;
    document.getElementById('selectedCountryName').textContent = country;
    if (verificationData[country]) {
        populateVerificationData(country, verificationData[country]);
    } else {
        populateGenericVerificationData(country);
    }
    const el = document.getElementById('verificationResults');
    el.style.display = 'block';
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function populateVerificationData(country, data) {
    ['abortion', 'maternity', 'marriage', 'bodilyRights', 'safety'].forEach(key => {
        if (data[key]) populatePolicySection(key, data[key]);
    });
}

function populatePolicySection(policyType, d) {
    const status   = document.getElementById(`${policyType}Status`);
    const rationale= document.getElementById(`${policyType}Rationale`);
    const sources  = document.getElementById(`${policyType}Sources`);
    if (!status) return;

    const cls = `status-${d.status.toLowerCase()}`;
    status.innerHTML = `
        <div class="status-display">
            <div class="policy-status ${cls}">${d.status}</div>
            <span class="status-text">Score: ${d.score}/3</span>
        </div>
        <div style="margin-top:.5rem;color:var(--text-2)">${d.description}</div>`;

    rationale.innerHTML = `<h5>Scoring Rationale</h5><p>${d.rationale}</p>`;

    const list = d.sources.map(s => `<li><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.title}</a></li>`).join('');
    sources.innerHTML = `<h5>Primary Sources</h5><ul>${list}</ul>`;
}

function populateGenericVerificationData(country) {
    const generic = {
        abortion: {
            status: 'Pending', score: '?', description: 'Detailed data collection in progress',
            rationale: `Comprehensive analysis for ${country} is currently being researched.`,
            sources: [
                { title: 'WHO — Abortion Care', url: 'https://www.who.int/teams/sexual-and-reproductive-health-and-research/areas-of-work/abortion-care' },
                { title: 'Center for Reproductive Rights — World Map', url: 'https://reproductiverights.org/maps/abortion-worldwide/' },
                { title: 'Guttmacher Institute — Global Data', url: 'https://www.guttmacher.org/geography' }
            ]
        },
        maternity: {
            status: 'Pending', score: '?', description: 'Detailed data collection in progress',
            rationale: `Comprehensive analysis for ${country} is currently being researched.`,
            sources: [
                { title: 'ILO — Maternity Protection', url: 'https://www.ilo.org/topics/maternity-protection' },
                { title: 'OECD — Parental Leave Policies', url: 'https://www.oecd.org/en/topics/sub-issues/parental-leave.html' },
                { title: 'World Bank — Women, Business and the Law', url: 'https://wbl.worldbank.org/' }
            ]
        },
        marriage: {
            status: 'Pending', score: '?', description: 'Detailed data collection in progress',
            rationale: `Comprehensive analysis for ${country} is currently being researched.`,
            sources: [
                { title: 'UNICEF — Child Marriage', url: 'https://www.unicef.org/protection/child-marriage' },
                { title: 'ILGA World — Legal Atlas', url: 'https://ilga.org/what-we-do/maps-and-country-profiles' },
                { title: 'UN Women — Digital Library', url: 'https://www.unwomen.org/en/digital-library' }
            ]
        },
        bodilyRights: {
            status: 'Pending', score: '?', description: 'Detailed data collection in progress',
            rationale: `Comprehensive analysis for ${country} is currently being researched.`,
            sources: [
                { title: 'WHO — Violence Against Women', url: 'https://www.who.int/teams/social-determinants-of-health/violence-prevention' },
                { title: 'UNFPA — State of World Population', url: 'https://www.unfpa.org/swp' },
                { title: 'Human Rights Watch — Women\'s Rights', url: 'https://www.hrw.org/topic/womens-rights' }
            ]
        },
        safety: {
            status: 'Pending', score: '?', description: 'Detailed data collection in progress',
            rationale: `Comprehensive safety analysis for ${country} is currently being researched.`,
            sources: [
                { title: 'WHO — Violence Against Women Prevalence Estimates', url: 'https://www.who.int/publications/i/item/9789240022256' },
                { title: 'Georgetown — Women, Peace & Security Index', url: 'https://giwps.georgetown.edu/the-index/' },
                { title: 'World Bank — Women, Business and the Law', url: 'https://wbl.worldbank.org/' }
            ]
        }
    };
    populateVerificationData(country, generic);
}

function hideVerification() {
    document.getElementById('verificationResults').style.display = 'none';
}
