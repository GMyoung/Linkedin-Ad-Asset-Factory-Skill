---
name: linkedin-ad-asset-factory
description: Run the Codex-only setup and approval-gated B2B LinkedIn ad asset workflow. Use inside Codex CLI or the Codex desktop harness for first-time plugin setup, OpenAI API key guidance, factory discovery, layered campaign intake, dry-runs, audit review, approved image generation, revisions, exports, or factory changes.
---

# LinkedIn Ad Asset Factory

Run this skill only inside a Codex harness. If `codex` is unavailable, stop and direct the user to install or open Codex; do not attempt to operate this skill from another agent runtime.

## First invocation: run setup before campaign work

1. Run the plugin preflight from the skill directory:

   ```powershell
   python ../../scripts/bootstrap_codex.py --check-only --json
   ```

2. Read [references/initial-setup.md](references/initial-setup.md). Report only setup status; never print, request, or persist a secret value.
3. If the plugin is not installed, tell the user to run the repository bootstrap command from `README.md`, then start a new Codex task.
4. If `OPENAI_API_KEY` is missing, walk the user through setting it themselves. Dry-run remains available without a key; real image generation does not.
5. Resolve `FACTORY_ROOT` from the user-provided path, current directory, or workspace entrypoints. If no implementation exists, scaffold it only when the user asks to build one.

Do not repeat the setup walkthrough after preflight is healthy unless the user asks or a required status changes.

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

Report the Codex setup status, command run, `FACTORY_ROOT`, dry-run/real mode, selected pattern and visual IDs, audit result, output/review location, and the next safe command. Never include secret values.
