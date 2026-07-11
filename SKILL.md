---
name: linkedin-ad-asset-factory
description: Build, modify, or operate an end-to-end B2B LinkedIn ad image asset factory from URLs, PDFs, images, text, brand documents, reference ads, and campaign briefs. Use for factory scaffolding or architecture changes, layered source intake, design extraction, dry-run briefs and audits, browser review, per-asset revisions, approved OpenAI image generation, Markdown export, or Google Drive handoff.
---

# LinkedIn Ad Asset Factory

Use one staged workflow for both engineering the factory and operating it. Keep the factory implementation and the user-facing workflow as two layers of the same system, not separate skills.

## Load only the references needed

- Read [references/workflow.md](references/workflow.md) before operating a campaign or changing the user journey.
- Read [references/architecture.md](references/architecture.md) before scaffolding, refactoring, or changing source ingestion, decisions, briefs, prompts, taxonomy, or browser orchestration.
- Read [references/taxonomy.md](references/taxonomy.md) before selecting, adding, or changing patterns and visual vocabularies.
- Read [references/qa-and-safety.md](references/qa-and-safety.md) before real generation and before changing audits, error handling, outputs, or acceptance tests.

## Choose the working mode

Select one mode from the request and current workspace:

1. **Operate**: run an existing factory from intake through export.
2. **Build or modify**: create or change the reusable factory implementation, then exercise the affected operational stages.
3. **Review or recover**: inspect an existing output, fix audit or generation failures, revise selected assets, or resume from the last valid stage.

Do not ask the user to choose a mode when it is clear from the request.

## Discover the implementation

Resolve the package root in this order:

1. Use the path explicitly provided by the user.
2. Use the current directory if it contains `generate_linkedin_assets.py` or `workflow_server.py`.
3. Search the workspace for those entrypoints and prefer a package that also contains `asset_factory/`.
4. If no implementation exists and the user asked to build one, scaffold the modular target described in `architecture.md`.
5. If no implementation exists and the user only asked to operate one, report the missing implementation and ask for its location.

Treat the discovered path as `FACTORY_ROOT`. Run package commands from there. Do not bake a machine-specific absolute path into the skill or generated project.

## Execute the stage gate

Track the current stage and preserve artifacts from completed stages:

| Stage | Gate | Required result |
|---|---|---|
| 0. Preflight | Implementation and entrypoints found or scaffolded | Project root, mode, dependency and git status |
| 1. Intake | Durable design source plus campaign inputs collected | Structured request with missing fields called out |
| 2. Classify | Every source has one explicit role | Separate source lists and provenance |
| 3. Extract | Design and content facts are usable | `design_profile` and `content_facts` inputs |
| 4. Plan | Campaign, taxonomy, and variations are selected | Auditable selection reasons and variant plan |
| 5. Dry run | No image API call | Briefs, prompts, copy plan, preview, and audit |
| 6. Approve | Audit passes and reviewer approves | Frozen approved briefs |
| 7. Generate | User explicitly authorizes real generation | Images and incremental manifests |
| 8. Revise | Selected assets are changed without losing approved work | Per-asset revision log and updated asset |
| 9. Export | Final set is approved | Markdown bundle and optional Drive upload |
| 10. Report | Run is auditable | Commands, paths, models, taxonomy, warnings, and next action |

Never jump from intake to paid generation. Default to Stage 5 dry-run. Enter Stage 7 only after explicit real-generation intent and Stage 6 approval.

## Intake contract

Require at least one durable design source before generating assets: a brand guide, design-system page, approved ad set, screenshot set, brand asset, or a design-language note. A previously generated `design_profile.json` is an output, not the only durable source.

Collect or infer:

- content source or landing-page copy;
- audience, offer, CTA, funnel, count, size, language, and output location;
- dry-run or real generation;
- reference examples, brand assets, and factual evidence where relevant.

Keep these source roles separate:

- `design_sources`
- `content_sources`
- `generation_requirements`
- `reference_examples`
- `brand_assets`
- `factual_evidence`

Do not collapse them into one generic context block.

## Build and modification rules

When building or changing the factory:

1. Use the module boundaries and structured data contracts in `architecture.md`.
2. Route built-in and user-added taxonomy through the same registry and validation path.
3. Keep visible image copy in structured `on_image_text` slots; derive the long prompt from the structure.
4. Keep the browser workflow as an orchestrator over extraction, dry-run, approval, generation, revision, and export. Do not create a second hidden generator.
5. Add or update tests for the changed stage, then run the relevant acceptance checks from `qa-and-safety.md`.
6. Preserve existing user changes and inspect git scope before committing or publishing.

## Generation rules

- Use `client.images.generate` for normal text-to-image generation.
- Default the configurable image model to `gpt-image-2`.
- Do not pass `response_format`; read `result.data[0].b64_json`.
- Allow `quality` only from `low`, `medium`, `high`, or `auto`.
- Use image editing only for explicit image-conditioned work or revision of an existing generated asset.
- Read `OPENAI_API_KEY` from the environment or a gitignored `.env`; never hardcode or record it.
- Save structured decision, brief, prompt, response, failure, and QA artifacts so every asset is reproducible.

## Review and revision rules

- Inspect `dry_run_audit.json` or the browser audit panel before recommending real generation.
- Resolve source fragments, UI noise, blocked-page text, encoding artifacts, word-budget failures, and missing source-message coverage.
- Freeze approved briefs before generation so reviewer edits survive.
- Apply a revision to the selected asset only. When a generated image exists, edit that image and preserve composition unless the user requests a redesign.
- Keep generated images attached to their matching `asset_id` cards and write partial progress after each image.

## Safety

- Do not copy third-party ads, layouts, logos, characters, people, or exact copy.
- Do not invent statistics, customers, awards, analyst quotes, testimonials, or partnerships.
- Do not use bot-protection, captcha, access-denied, or error-page screenshots as design or content evidence.
- Do not create fake LinkedIn controls or deceptive news screenshots.
- Treat usage and cost counters as estimates unless exact API metadata is available.
- Never place API keys, tokens, passwords, private keys, or secret values in source, artifacts, docs, logs, chat, or indexes.

## Completion response

Report:

- files or artifacts created or changed;
- the command run and the package root;
- output directory and review URL, if a server is running;
- dry-run versus real generation and models used;
- selected pattern and visual IDs with reasons;
- audit status, failures, missing inputs, and QA warnings;
- export path and Drive link only when the upload actually succeeded;
- one copyable next command when further action remains.
