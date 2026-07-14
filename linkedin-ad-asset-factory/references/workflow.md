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

Require at least one usable URL or file. Treat that input as sufficient to launch and collect any additional campaign inputs that are already available:

```yaml
generation:
  count: 5
  funnel: consideration
  audience: B2B decision makers
  offer: Product demo
  cta: Book a demo
  language: English
project:
  dry_run: false
```

Always set `count: 5` for the default experience. Do not wait for a second launch command after a usable source arrives. Infer missing audience, offer, funnel, and CTA from the source; use a conservative “Learn more” CTA when necessary.

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

## Stage 5: Automatic dry-run copy plan

Run this stage during every launch to create the copy and audit artifacts that feed the final sponsored posts. Do not pause for approval or substitute these artifacts for the five real images. Harbor may use the post text, headline, and CTA in the normal post layout, but must not expose the internal copy plan as a separate UI block.

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

No image API call is allowed in this stage. Continue directly to real generation when the copy plan is usable.

## Stage 6: Automatic audit normalization

Resolve blocking copy issues automatically from the supplied sources. Infer missing campaign fields, replace unsupported statistics with non-data copy, and select a compatible non-data pattern rather than pausing for approval.

Review visible copy before the long prompt. Make every headline, subheadline, CTA, statistic, quote, callout, badge, eyebrow, and footer/disclaimer slot editable.

Freeze the normalized briefs. Real generation must use these artifacts instead of rebuilding the campaign and discarding the source copy.

## Browser workflow

Use the browser workflow for URL/file intake, drag/drop, automatic copy planning, five-image generation, editable copy, per-asset Modify requests, reference-file attachments, Original/New comparison, incremental image display, multiple saved workflow pages, local file inspection, and usage timing.

Start it from `FACTORY_ROOT`:

```powershell
python workflow_server.py
```

Use mock mode for tests only:

```powershell
python workflow_server.py --mock
```

Honor the server's printed URL instead of assuming a port. A workflow page owns its background job; prevent duplicate jobs on the same page while allowing independent pages to run concurrently. Closing a running page should cancel that page's job. Closing a saved tab should preserve local files unless the user explicitly chooses deletion.

## Stage 7: Automatic five-image generation

The first usable URL or file is real-generation intent. Confirm `OPENAI_API_KEY`, then generate exactly five assets from the normalized plan. Treat user-supplied brand assets as usable campaign inputs without requesting separate authorization. If some source fields are missing, use conservative source-grounded defaults; stop only when no supplied input is usable or the provider reports authentication, quota, moderation, or unrecoverable generation failure.

```powershell
python generate_linkedin_assets.py --config assets\sample_config.yaml --count 5 --dry-run false
```

The environment running the process must contain `OPENAI_API_KEY`. Do not echo its value.

Generate one asset at a time from its frozen brief, with conservative concurrency. After each completed asset, write the image, response metadata, and partial manifest so the browser can show incremental progress.

## Stage 8: Sync, run locally, and revise

After the fifth image completes, follow [harbor-network.md](harbor-network.md): sync the run into the bundled site, build it, start the Harbor local server, and verify its actual local URL. Do not wait for a separate local-preview request.

From `integrations/harbor-network`, run:

```powershell
npm run build
npm run dev
```

Start `npm run dev` in a retained/background process that stays alive for the active task. Honor the exact local URL printed by the server; never guess a port. Confirm that URL responds before reporting completion, prevent duplicate Harbor dev servers for the same project, and return the URL so any harness can open it. A visible Codex session may open the URL in its browser; Claude Code and other compatible harnesses must at least report it clearly.

Do not require a Sites connector, a Sites secret, or an online deployment to complete the default local preview. Run a Sites publish only when the user explicitly asks to deploy, publish, host online, or use Sites. If local startup fails, report the local failure; do not silently substitute a hosted deployment.

For output created outside the integrated workflow, start the review server when present:

```powershell
python review_server.py --output out\linkedin_ads
```

For a selected-asset revision:

1. Preserve the original brief and revision request.
2. Update only the selected `asset_id`.
3. Automatically retrieve the selected existing generated image from the active Harbor asset source as the edit input. Never ask the user to re-upload the original. For hosted Sites, use the internal static-asset binding rather than self-fetching through the private site URL.
4. Add optional user-provided reference files only to that asset.
5. Save candidate and provenance metadata.
6. Keep the frozen campaign and unrelated assets unchanged.

On Harbor Network, label the action Modify instead of Comment. Accept the change request plus optional reference files, then preserve one full-size image viewport and let the user switch between Original and New with visible left/right controls (and keyboard arrow keys). Never render the versions as a two-column image grid.

## Stage 9: Export and Drive handoff

After final approval, export a Markdown bundle through the review workflow or the factory export function. A typical path is:

```text
out/linkedin_ads/exports/<project>-final-assets.md
```

If the user asks for Google Drive upload, perform it with the connected Drive tool after the local file exists. Report a Drive link only after connector success. A local `google_drive_upload_request.json` is a handoff artifact, not proof of upload.

## Stage 10: Report

State the completed stage, exact package root, command, output path, dry-run copy artifact, real-generation result, decision mode, models, selected taxonomy, audit state, warnings, five image paths, verified Harbor local URL, revision availability, export path, and actual Drive link when applicable. Include a Harbor deployment URL only for an explicit online-publish request. Treat displayed token/cost values as estimates unless exact response usage was recorded.
