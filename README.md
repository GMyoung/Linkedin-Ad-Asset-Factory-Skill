# LinkedIn Ad Asset Factory

> A portable B2B LinkedIn-ad skill: setup once, build a reviewed campaign, and generate only after approval.

[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-portable-0A66C2)](./linkedin-ad-asset-factory/SKILL.md)
[![OpenAI image API](https://img.shields.io/badge/OpenAI-image%20generation-412991)](https://platform.openai.com/api-keys)

LinkedIn Ad Asset Factory turns an Agent Skills-compatible coding harness into a focused creative-production workflow. It takes a campaign brief plus URLs, PDFs, images, copy, brand material, and factual evidence; produces reviewable briefs and dry-run artifacts; and requires explicit approval before paid image generation.

This is a process, not a prompt dump:

```text
Set up -> Intake -> Extract -> Plan -> Dry run -> Audit -> Approve -> Generate -> Revise -> Export
```

## Quick start

1. Install the skill (about one minute).
2. Ask your harness to use `linkedin-ad-asset-factory`.
3. It begins with a setup walkthrough, then stops at dry-run until you approve generation.

## Install — one command

Requirements: Git and Python 3.10+. For real image generation, you will later configure your own OpenAI API key.

```text
git clone --depth 1 https://github.com/GMyoung/Linkedin-Ad-Asset-Factory-Skill.git
cd Linkedin-Ad-Asset-Factory-Skill
python setup.py
```

`setup.py` detects installed harnesses and installs the portable `SKILL.md` folder into each discovered skill directory. On Windows it copies the skill; on macOS/Linux it symlinks it, so `git pull` updates installed skills automatically.

Restart the harness (or open a new task), then say either:

```text
Use linkedin-ad-asset-factory to complete the initial setup walkthrough.
```

or simply describe the job:

```text
Create a five-asset LinkedIn campaign dry-run from this brief and these brand files.
```

## Supported harnesses

The skill itself works in any harness that discovers an Agent Skills directory containing `SKILL.md`. The installer knows the following common locations:

| Harness | Install command | Destination |
| --- | --- | --- |
| OpenAI Codex | `python setup.py --host codex` | `~/.codex/skills/` |
| Claude Code | `python setup.py --host claude` | `~/.claude/skills/` |
| Cursor | `python setup.py --host cursor` | `~/.cursor/skills/` |
| OpenCode | `python setup.py --host opencode` | `~/.config/opencode/skills/` |
| Factory Droid | `python setup.py --host factory` | `~/.factory/skills/` |
| Kiro | `python setup.py --host kiro` | `~/.kiro/skills/` |

Install every listed target with `python setup.py --host all`. For another compatible harness, give its skills parent directory directly:

```text
python setup.py --skills-dir /path/to/harness/skills
```

The installer refuses to replace an unmanaged existing skill. Review it first, then use `--force` only if replacement is intended. Check without changing anything:

```text
python setup.py --check --json
```

## First use: a safe setup walkthrough

The first invocation checks the installed skill, optional factory root, and only the presence—not the value—of `OPENAI_API_KEY`. It then guides intake and offers dry-run before any paid generation.

Set your API key yourself; never paste it into agent chat, commits, screenshots, or documents.

Windows PowerShell:

```powershell
$key = Read-Host "Paste your OpenAI API key"
[Environment]::SetEnvironmentVariable("OPENAI_API_KEY", $key, "User")
Remove-Variable key
```

Restart your harness after setting it. On macOS/Linux, set the variable through your shell profile or your organization’s secret manager. The skill never reads or prints its value.

For a one-session macOS/Linux setup, start the harness from the same terminal:

```bash
read -rs OPENAI_API_KEY
export OPENAI_API_KEY
printf '\n'
```

For persistent use, prefer your OS or organization secret manager; alternatively use a gitignored `.env` at the factory root if that factory supports it. Never commit the file.

No key is needed for intake, planning, or dry-run. A key plus explicit user approval is required for real image generation.

## What the skill does

| Stage | Outcome |
| --- | --- |
| Preflight | Verify environment, key presence, and optional factory root. |
| Intake | Separate design, content, requirements, references, brand assets, and factual evidence. |
| Extract | Turn supplied material into traceable campaign facts and visual guidance. |
| Plan | Select patterns/visuals and create structured variant briefs. |
| Dry run | Produce copy plans, prompt plans, manifests, and review artifacts without API spend. |
| Audit + approval | Check source grounding, claims, text budgets, and user approval. |
| Generate + revise | Create only approved assets; preserve approved work during targeted revisions. |
| Export | Produce Markdown and an optional handoff package. |

## Safety boundary

- Do not invent claims, outcomes, statistics, customers, awards, partnerships, or endorsements.
- Do not treat blocked, captcha, error, or bot-protection pages as campaign evidence.
- Do not copy third-party ad creative.
- Default to dry-run. Treat real generation as a paid, explicit-approval step.
- Keep API keys in environment variables or a gitignored secret store only.

## Repository layout

```text
.
├── setup.py                         # cross-harness installer and status check
└── linkedin-ad-asset-factory/
    ├── SKILL.md                     # portable agent execution contract
    ├── scripts/preflight.py         # secret-safe first-run status check
    └── references/                  # workflow, architecture, taxonomy, QA/safety
```

## Updating or removing

For symlink installs on macOS/Linux, update the clone and restart the harness:

```text
git pull
```

For Windows copy installs, rerun `python setup.py --host <name>` after `git pull`. To remove it, delete the managed `linkedin-ad-asset-factory` folder from the listed skills directory.

## Design inspiration

The installation and documentation model follows the useful parts of [gstack](https://github.com/garrytan/gstack): one command, automatic host detection, explicit per-host installation, a safe update path, and a workflow users can try immediately. This repository contains one portable creative-production skill rather than a harness-specific plugin.
