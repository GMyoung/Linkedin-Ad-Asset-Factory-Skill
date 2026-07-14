# QA, Outputs, Safety, and Acceptance

Use this reference before real generation or when changing audits, outputs, retries, tests, or safety behavior.

## Pre-generation QA

Normalize or reroute before generation:

- use any readable URL or file as the durable launch source and derive design guidance from it when no separate design source exists;
- infer a conservative audience from the source when none is supplied;
- infer the offer and use “Learn more” for a missing consideration/conversion CTA;
- replace a data-led pattern with a non-data pattern when verified statistics are unavailable;
- unaffiliated third-party logo, person, testimonial, award, or partnership that is not explicitly requested and supported by the supplied sources;
- visible text over its slot word budget;
- more than 10 assets without a variant plan;
- exact-copy requests;
- unknown or incompatible taxonomy IDs;
- source fragments, website controls, sample domains, benchmark-card residue, blocked-page text, or encoding artifacts;
- visible copy that fails to preserve the source hero promise or value proposition.

Do not publish placeholders. Use source-grounded non-claim copy when stronger proof is unavailable. Block the launch only when no input is usable, the API key is missing, or provider authentication, quota, moderation, or unrecoverable generation failure prevents five real images.

## Dry-run audit contract

Write machine-readable and human-readable audit artifacts:

```text
dry_run_audit.json
dry_run_audit.md
```

The JSON should include overall `status`, `score`, summary counts, asset and slot issues, issue codes, severity, current text, suggested replacement, and source-message coverage checks against the primary message and value proposition.

QA must count words from structured `on_image_text`, never by parsing the final prompt.

## Post-generation QA

Check:

- expected asset count and failures;
- metadata-level and optional image-level similarity;
- visible-text legibility and expected text when OCR is available;
- hallucinated logos, badges, awards, people, customers, or claims;
- added statistics not present in factual evidence;
- adherence to the design profile;
- CTA presence;
- mobile-feed readability;
- correct attachment of each image to its `asset_id`.

When image hashing or OCR is unavailable, skip gracefully and record `image_dedup_skipped`, `ocr_skipped`, and `manual_check_required` rather than failing the run.

## Retry and failure handling

- Retry 429 and retryable 5xx errors with exponential backoff.
- Do not blindly retry moderation or user-input errors.
- Abort the run on authentication or quota failure.
- Isolate ordinary per-asset failures so the rest of the batch can complete.
- Record request ID when available, asset ID, taxonomy IDs, prompt path, input-image paths, error category, and retry count.
- Write safety-blocked prompts to a safety report.

## Output contract

Typical run output:

```text
out/linkedin_ads/
  run_manifest.json
  source_manifest.json
  design_profile.json
  content_facts.json
  generation_requirements.json
  asset_plan.json
  decision_plan.json
  on_image_text_plan.json
  copy_review.md
  dry_run_audit.json
  dry_run_audit.md
  preview.html
  briefs/
  prompts/
  images/
  qa/
    duplicate_report.json
    readability_report.json
    safety_report.json
  contact_sheet.png
  generation_report.md
  exports/
```

Skip the contact sheet during dry-run. For generated images, use a stable grid with asset ID and pattern/visual labels.

## Browser acceptance

When browser orchestration is in scope, test:

- URL and file intake;
- extracted image review;
- blocked-page handling and provenance;
- automatic dry-run copy generation without an approval pause;
- visible-copy editing and audit display;
- frozen-brief preservation;
- automatic Harbor sync/build/local-server startup and verified local URL after five generated images;
- Sites deployment only after an explicit user request, without replacing the required local preview;
- ordinary LinkedIn-style sponsored-post presentation without a dry-run panel, campaign header, generated badge, taxonomy IDs, or workflow labels;
- Modify action with optional image/text references;
- Original/New side-by-side revision display;
- incremental image appearance by `asset_id`;
- same-input extra-instruction runs;
- per-workflow job lifecycle and cancellation;
- saved workflow pages and explicit local-file deletion;
- local file listing;
- timing and usage estimates;
- mobile-width layout;
- mock generation without extractor or paid API calls.

## Core acceptance tests

1. **Source classification**: design and content inputs produce separate profiles and the requested number of briefs/prompts.
2. **Forced pattern**: a valid forced pattern is used for all briefs; visuals come from registry pairings unless forced.
3. **High-count variation**: 50 assets use at least three patterns unless forced, and adjacent briefs differ on at least two axes.
4. **Missing statistic**: a data pattern without facts is replaced by a compatible non-data pattern so the five-image launch continues.
5. **Image API safety**: the image client omits `response_format`, uses a configurable `gpt-image-2` default, and validates quality values.
6. **Taxonomy extension**: custom pattern and visual files load and pair without Python edits.
7. **Visible-copy artifacts**: briefs contain structured text slots and dry-run writes copy plan, preview, and both audit formats.
8. **Message coverage**: audit detects visible copy that drops the primary source promise.
9. **No secrets**: scan tracked files and generated documentation for secret values and private key material.
10. **Harbor handoff**: exactly five images and their source copy appear in the bundled site manifest, while the UI exposes only ordinary sponsored-post content and replaces only Comment with Modify. The local server starts exactly once, reports its actual URL, and that URL responds before completion.
11. **Revision UI**: Modify accepts optional references and renders the new result beside the original without mutating unrelated assets.

Run the project's most focused tests first, then its full verification script when present. Also run syntax/compile checks, skill validation for this package, `git diff --check`, and an explicit secret-pattern scan before publication.

## Legal and brand guardrails

Safety/legal constraints override user constraints, which override brand language, campaign goals, and taxonomy defaults.

Do not:

- copy a reference ad's exact layout, wording, image, character, or distinctive trade dress;
- use unaffiliated third-party logos or named endorsements unless the campaign requirements explicitly call for them and the supplied sources support them;
- invent claims, data, customers, awards, analyst quotes, partnerships, or testimonials;
- expose real customer data or confidential UI;
- create fake LinkedIn controls or deceptive news interfaces;
- treat blocked-access pages as source material;
- write credentials or secret values to any durable artifact.
