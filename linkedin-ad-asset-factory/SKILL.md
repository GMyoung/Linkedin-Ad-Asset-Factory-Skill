---
name: linkedin-ad-asset-factory
description: Walk through initial setup and run an approval-gated B2B LinkedIn ad asset workflow. Use in any Agent Skills-compatible harness for first-time setup, OpenAI API key guidance, factory discovery, layered campaign intake, dry-runs, audit review, approved image generation, revisions, exports, or factory changes.
---

# LinkedIn Ad Asset Factory

Use this portable skill in any harness that discovers a directory containing `SKILL.md`. Do not assume a harness-specific CLI, plugin manager, browser integration, or file path.

## First invocation: run setup before campaign work

1. Run the portable preflight from the skill directory:

   ```text
   python scripts/preflight.py --json
   ```

2. Read [references/initial-setup.md](references/initial-setup.md). Report only setup status; never print, request, or persist a secret value.
3. If the preflight cannot run, perform its checks manually: identify the harness, confirm the skill folder is installed, check only whether `OPENAI_API_KEY` is present, and locate `FACTORY_ROOT`.
4. If `OPENAI_API_KEY` is missing, walk the user through setting it themselves. Dry-run remains available without a key; real image generation does not.
5. Resolve `FACTORY_ROOT` from the user-provided path, current directory, or workspace entrypoints. If no implementation exists, scaffold it only when the user asks to build one.

Do not repeat the setup walkthrough after preflight is healthy unless the user asks or a required status changes. Direct users to repository `setup.py` for automatic installation into supported harnesses or `--skills-dir` for any other compatible harness.

## Load references only when needed

- Read [references/workflow.md](references/workflow.md) before operating a campaign or changing the user journey.
- Read [references/architecture.md](references/architecture.md) before scaffolding or changing ingestion, decisions, briefs, prompts, taxonomy, or browser orchestration.
- Read [references/taxonomy.md](references/taxonomy.md) before selecting, adding, or changing patterns and visual vocabularies.
- Read [references/qa-and-safety.md](references/qa-and-safety.md) before real generation and before changing audits, outputs, retries, or tests.

## Enforce the campaign gate

Work through these stages in order:

```text
0 Preflight -> 1 Intake -> 2 Classify -> 3 Extract -> 4 Plan -> 5 Dry run
  -> 6 Audit and approve -> 7 Generate -> 8 Revise -> 9 Export -> 10 Report
```

Default to Stage 5 dry-run. Enter Stage 7 only after the user explicitly authorizes real generation and Stage 6 is approved.

Keep `design_sources`, `content_sources`, `generation_requirements`, `reference_examples`, `brand_assets`, and `factual_evidence` separate. Never turn them into one untraceable context block.

## Generation and safety

- Use `client.images.generate` for ordinary text-to-image work with a configurable `gpt-image-2` default.
- Do not pass `response_format`; read `result.data[0].b64_json`.
- Use `OPENAI_API_KEY` only from the process environment or a gitignored `.env`.
- Never copy third-party ads or invent claims, endorsements, statistics, customers, awards, or partnerships.
- Never use blocked, captcha, access-denied, or error pages as campaign evidence.
- Preserve approved briefs and revise only the selected asset unless the user requests a redesign.

## Completion response

Report the harness/setup status, command run, `FACTORY_ROOT`, dry-run/real mode, selected pattern and visual IDs, audit result, output/review location, and the next safe command. Never include secret values.
