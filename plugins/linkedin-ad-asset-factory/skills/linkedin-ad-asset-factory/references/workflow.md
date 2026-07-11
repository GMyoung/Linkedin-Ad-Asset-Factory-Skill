# Staged Operating Workflow

Use this reference for campaign operation, browser workflow changes, recovery, review, revision, export, or Drive handoff.

## Stage 0: Preflight

From `FACTORY_ROOT`, inspect the available entrypoints and project instructions. Prefer the project virtual environment when present.

Expected entrypoints:

```text
generate_linkedin_assets.py
workflow_server.py
review_server.py
asset_factory/
```

Confirm dependencies without printing secret values. Check only whether required environment variables are present.

## Stage 1: Intake

Require a durable design source and collect campaign inputs:

```yaml
generation:
  count: 5
  funnel: consideration
  audience: B2B decision makers
  offer: Product demo
  cta: Book a demo
  language: English
project:
  dry_run: true
```

If the user has not chosen paid generation, set `dry_run: true`.

## Stage 2: Classify sources

Maintain explicit source roles:

```yaml
sources:
  design_sources: []
  content_sources: []
  generation_requirements: []
  reference_examples: []
  brand_assets: []
  factual_evidence: []
```

Record provenance for every extracted fact and visual rule.

## Stage 3: Extract design and content

For website-only design sources, run the project's design extractor when available and request an asset manifest, logo, section screenshots, and reference sheets. Pass its `DESIGN.md` and asset manifest into the factory.

Treat a blocked live page as a diagnostic. If the project supports an archive fallback, preserve that provenance. Never treat a captcha, Cloudflare/Akamai/DataDome page, access-denied page, or error screenshot as a brand reference or factual source.

Validate that the resulting design and content inputs include:

- brand/design rules with source IDs;
- a primary message or value proposition;
- audience, pain, workflow, outcome, and proof facts when available;
- no sample-domain, demo-UI, pricing-card, step-number, or encoding debris.

## Stage 4: Plan

Build, in order:

1. `GenerationRequest`
2. `DesignProfile`
3. `ContentFacts`
4. `CampaignBrief`
5. selected pattern and visual candidates with scores and reasons
6. `VariantPlan`
7. one structured `AssetBrief` per asset

Use `rules` by default. Use `hybrid` only when optional text decisions are enabled and a rules fallback is acceptable. Use `api` only when the selected text provider is configured and failure should be explicit.

## Stage 5: Dry run

CLI form:

```powershell
python generate_linkedin_assets.py --config assets\sample_config.yaml --dry-run true
```

Use the package virtual-environment interpreter instead of `python` when present.

Required dry-run artifacts:

```text
asset_plan.json
on_image_text_plan.json
copy_review.md
dry_run_audit.json
dry_run_audit.md
preview.html
briefs/
prompts/
generation_report.md
```

No image API call is allowed in this stage.

## Stage 6: Audit and approval

Block recommendation of real generation when the dry-run audit is `needs_revision` or when required audience, offer, CTA, claims, or sources are missing.

Review visible copy before the long prompt. Make every headline, subheadline, CTA, statistic, quote, callout, badge, eyebrow, and footer/disclaimer slot editable.

Freeze the approved briefs. Real generation must use these approved artifacts instead of rebuilding the campaign and discarding edits.

## Browser workflow

Use the browser workflow for URL/file intake, drag/drop, extracted-image review, dry-run approval, editable copy, per-asset chat revisions, reference-file attachments, incremental image display, multiple saved workflow pages, local file inspection, and usage timing.

Start it from `FACTORY_ROOT`:

```powershell
python workflow_server.py
```

Use mock mode for tests only:

```powershell
python workflow_server.py --mock
```

Honor the server's printed URL instead of assuming a port. A workflow page owns its background job; prevent duplicate jobs on the same page while allowing independent pages to run concurrently. Closing a running page should cancel that page's job. Closing a saved tab should preserve local files unless the user explicitly chooses deletion.

## Stage 7: Real generation

Enter only after explicit approval and real-generation intent.

```powershell
python generate_linkedin_assets.py --config assets\sample_config.yaml --dry-run false
```

The environment running the process must contain `OPENAI_API_KEY`. Do not echo its value.

Generate one asset at a time from its approved brief, with conservative concurrency. After each completed asset, write the image, response metadata, and partial manifest so the browser can show incremental progress.

## Stage 8: Review and revise

For output created outside the integrated workflow, start the review server when present:

```powershell
python review_server.py --output out\linkedin_ads
```

For a selected-asset revision:

1. Preserve the original brief and revision request.
2. Update only the selected `asset_id`.
3. Use the existing generated image as edit input when available.
4. Add optional user-provided reference files only to that asset.
5. Save candidate and provenance metadata.
6. Keep the approved campaign and unrelated assets unchanged.

## Stage 9: Export and Drive handoff

After final approval, export a Markdown bundle through the review workflow or the factory export function. A typical path is:

```text
out/linkedin_ads/exports/<project>-final-assets.md
```

If the user asks for Google Drive upload, perform it with the connected Drive tool after the local file exists. Report a Drive link only after connector success. A local `google_drive_upload_request.json` is a handoff artifact, not proof of upload.

## Stage 10: Report

State the completed stage, exact package root, command, output path, dry-run/real mode, decision mode, models, selected taxonomy, audit state, warnings, review URL, export path, and actual Drive link when applicable. Treat displayed token/cost values as estimates unless exact response usage was recorded.
