# LinkedIn Ad Asset Factory

> A portable B2B LinkedIn-ad skill: give it any usable URL or file, generate five ads, and publish them to Harbor Network automatically.

[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-portable-0A66C2)](./linkedin-ad-asset-factory/SKILL.md)
[![OpenAI image API](https://img.shields.io/badge/OpenAI-image%20generation-412991)](https://platform.openai.com/api-keys)

LinkedIn Ad Asset Factory turns an Agent Skills-compatible coding harness into a focused creative-production workflow. Any readable URL or file starts a complete launch when `OPENAI_API_KEY` is configured: dry-run copy planning, five real image assets, and automatic deployment to the bundled Harbor Network site.

This is a process, not a prompt dump:

```text
Set up -> Intake any URL/file -> Plan copy -> Generate 5 -> Deploy Harbor -> Modify side by side
```

## Quick start

1. Install the skill (about one minute).
2. Ask your harness to use `linkedin-ad-asset-factory`.
3. Supply a URL or file. The skill runs the five-asset batch and deploys it without a second approval prompt.

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
Use this URL and the attached files to generate five LinkedIn ads and publish them to Harbor Network.
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

The first invocation checks the installed skill, optional factory root, and only the presence—not the value—of `OPENAI_API_KEY`. After that, any usable URL or file creates the dry-run copy, five real images, and a Harbor Network deployment.

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

No key is needed to inspect inputs, but the default launch requires a configured key because it must finish with five real images and a deployed site.

## What the skill does

| Stage | Outcome |
| --- | --- |
| Preflight | Verify environment, key presence, and optional factory root. |
| Intake | Separate design, content, requirements, references, brand assets, and factual evidence. |
| Extract | Turn supplied material into traceable campaign facts and visual guidance. |
| Plan | Select patterns/visuals and create structured variant briefs. |
| Copy plan | Produce the dry-run copy, prompts, manifests, and audit artifacts automatically. |
| Generate | Create exactly five real assets from the frozen source-grounded plan. |
| Deploy | Sync images and post copy into ordinary sponsored posts on the bundled Harbor Network site and publish it with Sites. |
| Modify | Accept a change request plus reference files and show the new ad beside the original. |
| Export | Produce Markdown and an optional handoff package. |

## Safety boundary

- Do not invent claims, outcomes, statistics, customers, awards, partnerships, or endorsements.
- Do not treat blocked, captcha, error, or bot-protection pages as campaign evidence.
- Do not copy third-party ad creative.
- Treat any usable URL or file as the launch request. Infer missing campaign fields conservatively and finish with five real images plus a Harbor deployment.
- Keep API keys in environment variables or a gitignored secret store only.

## Repository layout

```text
.
├── setup.py                         # cross-harness installer and status check
└── linkedin-ad-asset-factory/
    ├── SKILL.md                     # portable agent execution contract
    ├── integrations/harbor-network/ # bundled Sites deployment target
    ├── scripts/preflight.py         # secret-safe first-run status check
    ├── scripts/sync_harbor_campaign.py
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
