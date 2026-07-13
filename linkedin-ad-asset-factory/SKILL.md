---
name: linkedin-ad-asset-factory
description: Turn any supplied URL or file into five real B2B LinkedIn ad images and automatically publish them as ordinary sponsored posts on the bundled Harbor Network site. Use for first-time setup, source intake, five-image generation, Harbor deployment, per-ad Modify requests with reference uploads, side-by-side revisions, exports, or factory changes.
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
4. If `OPENAI_API_KEY` is missing, treat this as a required first-setup lesson, not merely a failed prerequisite. Before ending the turn, explain that real image generation needs a user-managed key, direct the user to the OpenAI API key dashboard, give the safe PowerShell steps in [references/initial-setup.md](references/initial-setup.md), tell them to restart Codex, and ask them to resume the same campaign afterward. Never ask them to paste the key into chat or a file, and never claim the launch is complete without five real images.
5. Resolve `FACTORY_ROOT` from the user-provided path, current directory, or workspace entrypoints. If no implementation exists, scaffold it only when the user asks to build one.

Do not repeat the setup walkthrough after preflight is healthy unless the user asks or a required status changes. Direct users to repository `setup.py` for automatic installation into supported harnesses or `--skills-dir` for any other compatible harness.

## Default launch behavior

Treat the presence of any usable URL or file as the launch instruction when `OPENAI_API_KEY` is configured. Do not wait for a second “start”, “generate”, approval, audience, offer, or CTA message:

- Use every readable supplied source. When one input must serve multiple roles, preserve its provenance while deriving both design and content guidance from it.
- Infer audience, offer, funnel, and CTA conservatively from the source. Default the CTA to “Learn more” when the source does not support a stronger conversion action.
- Produce the dry-run copy plan and audit as internal launch artifacts without pausing for review.
- Generate exactly five real image assets, one at a time, from that plan.
- Run `scripts/sync_harbor_campaign.py`, build the bundled Harbor Network site, and deploy it with Sites automatically.
- Publish each ad in the existing LinkedIn-style feed presentation: normal sponsor header, post text, image, headline/CTA caption, engagement row, and action bar. Use the dry-run copy as ordinary post/caption content, but never render a separate dry-run panel, campaign header, generated badge, taxonomy ID, or workflow label. Change only the Comment action to Modify; retain optional reference-file upload and an Original/New single-image revision viewer with left/right controls rather than a two-column image layout.
- For every Modify request, automatically use the selected generated ad as the edit input. Ask for only the change request and optional reference files; never ask the user to upload the original ad again or read it back through a private-site HTTP request.
- Treat user-supplied brand assets as campaign inputs without requesting separate authorization. Exclude unsupported claims and unaffiliated third-party marks or endorsements.

## Load references only when needed

- Read [references/workflow.md](references/workflow.md) before operating a campaign or changing the user journey.
- Read [references/architecture.md](references/architecture.md) before scaffolding or changing ingestion, decisions, briefs, prompts, taxonomy, or browser orchestration.
- Read [references/taxonomy.md](references/taxonomy.md) before selecting, adding, or changing patterns and visual vocabularies.
- Read [references/qa-and-safety.md](references/qa-and-safety.md) before real generation and before changing audits, outputs, retries, or tests.
- Read [references/harbor-network.md](references/harbor-network.md) before syncing, building, deploying, or revising the Harbor Network site.

## Enforce the campaign gate

Work through these stages in order:

```text
0 Preflight -> 1 Intake any URL/file -> 2 Classify -> 3 Extract -> 4 Plan
  -> 5 Dry-run copy/audit -> 6 Generate 5 -> 7 Sync Harbor
  -> 8 Build and deploy -> 9 Modify/compare -> 10 Report
```

Do not stop at the dry-run, local output, local preview, or deployment plan when a usable input and API key are available. Finish the five-image generation and Harbor deployment in the same launch.

Keep `design_sources`, `content_sources`, `generation_requirements`, `reference_examples`, `brand_assets`, and `factual_evidence` separate. Never turn them into one untraceable context block.

## Generation and safety

- Use `client.images.generate` for ordinary text-to-image work with a configurable `gpt-image-2` default.
- Do not pass `response_format`; read `result.data[0].b64_json`.
- Use `OPENAI_API_KEY` only from the process environment or a gitignored `.env`.
- Never copy third-party ads or invent claims, endorsements, statistics, customers, awards, or partnerships.
- Never use blocked, captcha, access-denied, or error pages as campaign evidence.
- Preserve the launch briefs and revise only the selected asset unless the user requests a redesign.

## Completion response

Report the harness/setup status, command run, `FACTORY_ROOT`, real-generation result, dry-run copy artifact, selected pattern and visual IDs, audit result, five image paths, Harbor deployment URL, and revision capability. Never include secret values.
