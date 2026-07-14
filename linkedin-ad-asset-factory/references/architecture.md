# Factory Architecture Contract

Use this reference when building or modifying the reusable factory.

## Module boundaries

Build a modular Python system rather than a single script:

```text
generate_linkedin_assets.py
workflow_server.py                  # when browser orchestration is in scope
review_server.py                    # when standalone review is in scope
asset_factory/
  config.py                         # argparse, YAML merge, GenerationRequest
  ingest.py                         # URL, PDF, image, text ingestion
  profiles.py                       # DesignProfile and ContentFacts
  patterns.py                       # compatibility facade, not raw constants
  variants.py                       # allocation and near-duplicate rules
  briefs.py                         # structured briefs and prompt assembly
  image_client.py                   # image generation/edit and retries
  qa.py                             # pre/post generation QA
  report.py                         # manifests and reports
  export.py                         # final Markdown bundle
  web_workflow.py                   # browser orchestration
  harbor_publish.py                 # optional wrapper around the bundled sync script
  taxonomy/
    models.py
    registry.py
    loaders.py
    validators.py
    selectors.py
  dry_run/
    text_plan.py
    audit.py
    review_export.py
    storyboard.py                   # optional low-fi preview
```

Existing projects may use a nearby equivalent. Preserve stable public entrypoints while narrowing responsibilities.

## Layered source model

Do not flatten sources into one context string:

| Layer | Purpose | Output |
|---|---|---|
| design language | visual and brand rules | `design_profile.json` |
| content facts | product, audience, offer, proof | `content_facts.json` |
| reference patterns | structural inspiration only | `reference_patterns.json` |
| generation requirements | count, format, CTA, constraints | `generation_requirements.json` |
| asset plan | taxonomy and variant decisions | `asset_plan.json` |
| outputs | prompts, images, QA, export | reports and manifests |

Preserve source IDs and section-aware provenance. Keep design-extractor output as an enrichment adapter, not a replacement for the source model.

## Structured data contracts

Use typed models such as Pydantic for:

- `GenerationRequest`
- `DesignProfile`
- `ContentFacts`
- `CampaignBrief`
- `PatternDefinition`
- `VisualDefinition`
- `VariantPlan`
- `AssetBrief`
- `OnImageTextSlot`
- generation response and QA records

An `AssetBrief` must include `asset_id`, pattern and visual IDs, selection reasons, funnel, audience, offer, structured visible text, layout/composition constraints, factual constraints, variation axes, negative rules, and a derived image prompt.

## Decision boundary

Use deterministic rules for configuration merge, validation, taxonomy compatibility, count allocation, prompt assembly, and near-duplicate detection.

Support auditable decision modes:

- `rules`: local deterministic selection only;
- `hybrid`: optional text API decision plan with rules fallback;
- `api`: configured text API required, fail clearly when unavailable.

Save API-assisted selections as structured decision artifacts. Accept Codex/user directives through a side channel or explicit decision file without mixing them into source layers.

## Taxonomy registry

Load built-ins and extensions through one facade:

```python
registry = TaxonomyRegistry.load(
    builtin_dir=Path("references/taxonomy"),
    extension_dirs=config.extensions.taxonomy_dirs,
)
```

Support YAML or JSON definition files for ordinary additions. A pattern defines triggers, compatible funnels, required facts, recommended visuals, visible text slots, layout slots, prompt fragments, and guardrails. A visual defines composition, required regions, avoidance rules, and default style axes.

Validation must ensure:

- IDs are unique and stable;
- every referenced visual exists;
- forced IDs exist;
- custom IDs use readable `P_CUSTOM_...` or `V_CUSTOM_...` prefixes;
- extensions do not silently replace built-ins unless an explicit override policy allows it.

Use scored selection strategies such as forced selection, built-in rules, extension keywords, and fallback. Record every selected candidate's reason.

## Prompt template method

Assemble prompts from structured blocks in a stable order:

```text
platform and format
campaign goal and audience
pattern
visual vocabulary
on-image text
layout and composition
design language
factual constraints
variation axes
negative rules
```

Definitions may contribute fragments, but they must not own the entire prompt. Generate the visible-copy block from `on_image_text`; never maintain a divergent duplicate inside the long prompt.

## Variation engine

Vary at least two axes among hook angle, layout, visual metaphor, color treatment, CTA treatment, and proof treatment. Adjacent briefs must differ on at least two axes.

- Count up to 5: use 1-2 compatible patterns.
- Count 6-25: use 2-4 patterns, 2-4 visuals, and at least 3 hook angles.
- Count above 25: use 3-7 patterns and keep one pattern below 40 percent unless forced.

Metadata-based duplicate detection is mandatory. Image hash and OCR checks are optional and must skip gracefully with explicit manual-QA flags when dependencies are absent.

## Image API contract

For text-to-image generation:

```python
result = client.images.generate(
    model=model,
    prompt=prompt,
    size=size,
    quality=quality,
    output_format=output_format,
)
image_base64 = result.data[0].b64_json
```

Do not pass `response_format`. Keep the model configurable with default `gpt-image-2`. Accept `quality` values `low`, `medium`, `high`, or `auto`. Use conservative concurrency and exponential backoff for rate limits and retryable server errors. Stop the run on authentication or quota failures; isolate ordinary per-asset failures.

Use image editing when an existing image or explicit reference image is part of the task. Deduplicate image inputs and record them in revision provenance.

## Browser workflow boundary

The browser layer orchestrates the same extractor, structured artifacts, automatic copy audit, image client, Harbor handoff, and export layer used by the CLI. It must not recalculate frozen briefs during generation.

Support:

- URL and file intake;
- extracted-input review;
- automatic dry-run copy audit and visible-copy editing;
- frozen launch briefs;
- per-workflow background jobs;
- incremental asset-image attachment by `asset_id`;
- per-asset revisions and reference uploads;
- Original/New side-by-side revision display;
- saved workflow pages;
- local file inspection and explicit destructive deletion;
- timing and estimated usage;
- mobile-width layout;
- mock mode for tests.

The bundled Harbor Network project is an output adapter, not a second campaign engine. Feed it only the generated images and structured `on_image_text_plan.json` data through `scripts/sync_harbor_campaign.py`; then build it and launch a verified local server by default. Sites build and hosting are optional and require an explicit user request. Keep hosted revision image bytes in its logical `AD_ASSETS` R2 binding.

## Configuration and secrets

Use argparse and YAML, with CLI values overriding config. Store only environment-variable names and setup instructions. Read `OPENAI_API_KEY` from the environment or a gitignored `.env`. Never serialize secret values into state, reports, browser responses, docs, or logs.
