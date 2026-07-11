# LinkedIn Creative Taxonomy

Use stable built-in IDs. Store their full definitions as registry data in the implementation; do not reproduce the table as scattered conditionals.

## Content patterns

| ID | Pattern | Typical trigger |
|---|---|---|
| P01 | Role callout plus guide | role-specific guide or report |
| P02 | Industry vertical scene | healthcare, retail, finance, energy |
| P03 | Regional localization | country, region, city, local market |
| P04 | Original data report | survey or proprietary data |
| P05 | Benchmark report | compare with market |
| P06 | Trend or future report | trends, forecast, future of X |
| P07 | Executive/sample research | executives or decision makers |
| P08 | Competitive knowledge gap | glossary, must-know, beat competitors |
| P09 | eBook/report mockup | downloadable long-form asset |
| P10 | Checklist/cheat sheet | practical short lead magnet |
| P11 | Template/toolkit | plug-and-play asset |
| P12 | One-page quick win | one-page guide or template |
| P13 | Assessment/calculator | scorecard, calculator, tool |
| P14 | Buyer/market guide | vendor comparison |
| P15 | Free trial/product trial | start trial or use product |
| P16 | ROI/quantified value | time, cost, or speed benefit |
| P17 | Brand/product one-liner | awareness promise |
| P18 | Product/feature launch | launch or new feature |
| P19 | Product beauty shot | visually distinctive product |
| P20 | UI/workflow preview | show how product works |
| P21 | Technical flow/architecture | engineers, IT, technical buyer |
| P22 | Before/after | pain to desired state |
| P23 | Customer success story | case study or customer result |
| P24 | Human story | emotional awareness proof |
| P25 | User/partner video story | testimonial or video story |
| P26 | Brand/product carousel story | sequential story |
| P27 | Expert quote | expert or speaker |
| P28 | Audience pain quote | voice-of-customer pain |
| P29 | Strong question opener | qualifying pain question |
| P30 | FOMO/common trait | what top leaders do |
| P31 | Numbered list/roundup | findings, rules, experts |
| P32 | Third-party authority | analyst, university, institution |
| P33 | Logo cloud/name-drop | customers, partners, experts |
| P34 | Grant/regulation/deadline | funding, eligibility, deadline |
| P35 | Webinar/event | speaker, date, session |
| P36 | In-person event | conference, booth, reserve spot |
| P37 | Course/skill growth | learning, certification, training |
| P38 | Career outcome | hiring or career growth |
| P39 | Community/partner support | channel or builder community |
| P40 | Carousel value claims | multiple benefits |
| P41 | Carousel data story | multiple data points |
| P42 | Carousel product/space tour | modules or spaces |
| P43 | Pure type poster | one strong message |
| P44 | Big-number poster | one verified number |
| P45 | Editorial/news style | article or trend content |
| P46 | Seasonal/calendar trigger | holiday or year-end |
| P47 | Trend/social issue | broader issue tie-in |
| P48 | Crisis/new normal | disruption or recovery |
| P49 | Humor/meme | business-relevant thumb stopper |
| P50 | Unusual visual | strange high-contrast concept |
| P51 | Local face/cultural context | localized creative |
| P52 | Owned mascot/character | recurring owned character |
| P53 | Saturated gradient poster | color-led awareness |
| P54 | Dark technology/enterprise | AI, data, cloud, security |
| P55 | Minimal premium | restrained high-end message |
| P56 | Poll/choice | engagement mechanic |
| P57 | 1:1 video story | video thumbnail concept |
| P58 | Short infographic video | motion explainer thumbnail |
| P59 | Anti-cliche | “not another report” angle |
| P60 | Retargeting “why us” | warm-audience proof |
| P61 | Joint launch | co-branded report or partner |
| P62 | Creative CTA button | conversion CTA focus |
| P63 | How-to/article | practical content flow |
| P64 | Technical table/model | expert specificity |
| P65 | Space/experience | physical service or place |

## Visual vocabularies

| ID | Visual vocabulary | Typical use |
|---|---|---|
| V01 | Full brand color plus large type | strong point, report, event |
| V02 | Split image and copy | guide, industry, human story |
| V03 | Report/checklist mockup | eBook, playbook, checklist |
| V04 | Big number/chart card | data, benchmark, trend |
| V05 | Unified carousel cards | multi-point story or tour |
| V06 | Editorial/news | article, trend, social issue |
| V07 | Portrait/real scene | story, quote, course |
| V08 | Product UI/device frame | SaaS, app, workflow |
| V09 | Flow/architecture diagram | technical process |
| V10 | Quote card | customer, expert, pain quote |
| V11 | Logo cloud | customer/partner proof |
| V12 | Product beauty shot | hardware or strong product form |
| V13 | 1:1 video thumbnail | story, event, demo |
| V14 | Dark technology background | AI, data, security, enterprise |
| V15 | Saturated gradient | awareness or thumb stopper |
| V16 | Minimal whitespace | premium single-value message |
| V17 | Mascot/character | owned brand character |
| V18 | Poll/choice | lightweight engagement |
| V19 | Event poster | webinar, conference, course |
| V20 | Space/experience tour | office, travel, physical service |

## Selection rules

1. Honor a valid forced pattern or visual unless it violates guardrails.
2. Match report, guide, checklist, and template offers to P01-P14.
3. Match trial, demo, ROI, and conversion goals to P15-P22 or P60-P62.
4. Match case studies and testimonials to P23-P28.
5. Match question, FOMO, quote, and pain hooks to P29-P33.
6. Match events and courses to P35-P37.
7. Match multi-card content to P40-P42.
8. For awareness without a concrete offer, consider P17-P19, P43-P59, P63, or P65.
9. Add P03 or P51 only when localization is real.
10. Add P21 or P64 for genuinely technical audiences.
11. Do not select P04, P05, or P44 without verified data. A dry-run placeholder must be visibly flagged; real generation stays blocked.
12. For large sets, select multiple compatible patterns rather than adjective-only prompt variants.

## Funnel pools

- Awareness: P17-P19, P23-P27, P37-P39, P43-P58, P61, P63, P65.
- Consideration: P01-P14, P20-P22, P29-P33, P40-P42, P45-P48, P59, P64.
- Conversion: P15-P16, P20-P22, P34-P36, P60-P62.
- Retargeting: P14-P16, P20, P23, P31-P33, P35-P36, P60-P62.

Filter pools against required facts, platform/format compatibility, allowed/blocked lists, and registry pairing data. Save selection scores and reasons.

## Custom definitions

Use data files such as:

```yaml
id: P_CUSTOM_DEALER_QUOTE
kind: pattern
name: Dealer quote with product proof
compatible_funnels: [consideration, conversion]
triggers:
  keywords: [dealer, rep, quote, margin]
required_facts:
  any_of: [proof_points, stats]
recommended_visuals: [V08, V_CUSTOM_AGENT_PANEL]
text_slots:
  - key: headline
    label: Headline
    required: true
    max_words: 9
  - key: cta
    label: CTA
    required: true
    max_words: 4
guardrails:
  - Do not invent dealer names or statistics.
```

Allow a pattern-to-visual pairing file to recommend or block visuals. Validate every referenced ID before planning.
