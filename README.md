# LinkedIn Ad Asset Factory

> Give an Agent Skills-compatible coding harness any usable URL or file, generate five B2B LinkedIn ad images, and publish them to the bundled Harbor Network site.

[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-portable-0A66C2)](./linkedin-ad-asset-factory/SKILL.md)
[![OpenAI image API](https://img.shields.io/badge/OpenAI-image%20generation-412991)](https://platform.openai.com/api-keys)

LinkedIn Ad Asset Factory is a portable Agent Skill. With `OPENAI_API_KEY` configured, any readable URL or file starts the complete workflow:

```text
Preflight -> Intake -> Copy plan -> Generate 5 -> Publish Harbor -> Modify/compare
```

## Install

### Recommended: install with the Agent Skills CLI

Requirements: Node.js/npm. The installer finds the skill in this repository and asks which supported harness should receive it.

```bash
npx skills add GMyoung/Linkedin-Ad-Asset-Factory-Skill --skill linkedin-ad-asset-factory -g
```

Install directly for a specific harness:

```bash
# OpenAI Codex
npx skills add GMyoung/Linkedin-Ad-Asset-Factory-Skill --skill linkedin-ad-asset-factory -g -a codex --copy

# Claude Code
npx skills add GMyoung/Linkedin-Ad-Asset-Factory-Skill --skill linkedin-ad-asset-factory -g -a claude-code --copy
```

`--copy` avoids symlink restrictions on Windows. Remove it if you prefer a symlinked installation that follows a single canonical copy.

### Python fallback

Use the repository installer when Node.js is unavailable or when you want an explicit destination. Requirements: Git and Python 3.10+.

```bash
git clone --depth 1 https://github.com/GMyoung/Linkedin-Ad-Asset-Factory-Skill.git
cd Linkedin-Ad-Asset-Factory-Skill
python setup.py
```

`python setup.py` installs into every detected supported harness. If none is detected, it falls back to the portable user directory `~/.agents/skills/`. This confirms that the skill files are present and valid; it cannot guarantee that a running harness has refreshed its skill index.

Target one harness explicitly:

```bash
python setup.py --host codex
python setup.py --host claude
python setup.py --host cursor
python setup.py --host opencode
python setup.py --host factory
python setup.py --host kiro
python setup.py --host universal
```

For another Agent Skills-compatible harness, pass the parent directory that it actually scans:

```bash
python setup.py --skills-dir /path/to/harness/skills
```

The final layout must be:

```text
<skills-root>/
└── linkedin-ad-asset-factory/
    ├── SKILL.md
    ├── scripts/
    ├── references/
    └── integrations/
```

## Supported Python installer targets

| Harness | Destination |
| --- | --- |
| OpenAI Codex | `$CODEX_HOME/skills/`, default `~/.codex/skills/` |
| Claude Code | `~/.claude/skills/` |
| Cursor | `~/.cursor/skills/` |
| OpenCode | `$OPENCODE_CONFIG_DIR/skills/`, otherwise `$XDG_CONFIG_HOME/opencode/skills/` |
| Factory Droid | `~/.factory/skills/` |
| Kiro | `$KIRO_HOME/skills/`, default `~/.kiro/skills/` |
| Portable/universal | `~/.agents/skills/` |

`python setup.py --host all` installs all vendor-specific targets in the table, excluding the universal target to avoid duplicate skill entries. Add `--host universal` separately when you need it.

The installer refuses to replace an unmanaged destination unless you pass `--force`. Review that directory before forcing replacement.

## Verify installation

Check every known destination without changing files:

```bash
python setup.py --check --json
```

The report distinguishes:

- `present`: the target folder exists;
- `managed`: this `setup.py` created the copy or symlink;
- `skill_file_present`: `SKILL.md` exists;
- `frontmatter_valid`: required `name` and `description` metadata are valid;
- `loadable`: the folder has a valid Agent Skill layout.

Then restart the harness or open a new task and confirm that `linkedin-ad-asset-factory` appears in its skill picker/list. File validation and harness discovery are separate checks.

If the skill does not appear:

1. Confirm the final path ends in `linkedin-ad-asset-factory/SKILL.md`.
2. Install inside the same environment where the harness runs. Windows, WSL, containers, SSH hosts, and remote workspaces have different home directories.
3. Check whether a custom agent disables skills or requires an explicit skill resource/path.
4. Restart the harness or open a new task.
5. Rerun with `--skills-dir` pointing to the exact directory documented by that harness.

## First use

After installation, explicitly invoke the skill or describe a matching job:

```text
Use linkedin-ad-asset-factory to complete the initial setup walkthrough.
```

```text
Use this URL and the attached files to generate five LinkedIn ads and publish them to Harbor Network.
```

The first invocation checks only whether `OPENAI_API_KEY` is present; it never prints or records the value. No key is required to inspect inputs, but real image generation requires a user-managed key.

Set the key privately at Windows user scope:

```powershell
$secureKey = Read-Host "Paste your OpenAI API key" -AsSecureString
$key = [System.Net.NetworkCredential]::new('', $secureKey).Password
[Environment]::SetEnvironmentVariable("OPENAI_API_KEY", $key, "User")
Remove-Variable key, secureKey
```

Completely restart the harness afterward. Never paste a key into agent chat, source code, a Google Doc, screenshots, or tracked `.env` files.

For a one-session macOS/Linux setup, launch the harness from the same terminal:

```bash
read -rs OPENAI_API_KEY
export OPENAI_API_KEY
printf '\n'
```

## What the skill does

| Stage | Outcome |
| --- | --- |
| Preflight | Verify the skill, key presence, and optional factory root. |
| Intake | Separate design, content, requirements, references, brand assets, and factual evidence. |
| Extract | Turn supplied material into traceable campaign facts and visual guidance. |
| Plan | Select patterns and visuals, then create structured variant briefs. |
| Copy plan | Produce copy, prompts, manifests, and audit artifacts. |
| Generate | Create exactly five real assets from the source-grounded plan. |
| Local Harbor preview | Sync the five sponsored posts into Harbor Network, start its local server, and verify the printed local URL. |
| Optional publish | Deploy Harbor with Sites only when the user explicitly asks to publish or host it online. |
| Modify | Revise one selected ad with an optional reference upload and Original/New viewer. |

## Safety boundary

- Never invent claims, outcomes, statistics, customers, awards, partnerships, or endorsements.
- Never treat blocked, captcha, access-denied, or error pages as campaign evidence.
- Never copy third-party ad creative.
- Keep API keys in environment variables or a gitignored secret store only.
- Treat any usable URL or file as the launch request when required prerequisites are healthy.

## Repository layout

```text
.
├── setup.py
└── linkedin-ad-asset-factory/
    ├── SKILL.md
    ├── integrations/harbor-network/
    ├── scripts/preflight.py
    ├── scripts/sync_harbor_campaign.py
    └── references/
```

## Updating or removing

For installations managed by the Agent Skills CLI:

```bash
npx skills update linkedin-ad-asset-factory -g
npx skills remove linkedin-ad-asset-factory -g
```

For Python installs, update the clone and rerun the same host command:

```bash
git pull
python setup.py --host <host>
```

On Windows the Python installer copies the skill. On macOS/Linux it symlinks by default; pass `--copy` when an independent copy is preferable.

## Design inspiration

The Python fallback follows the explicit per-host approach used by [gstack](https://github.com/garrytan/gstack). The recommended installation path uses the cross-harness [Agent Skills CLI](https://github.com/vercel-labs/skills), which maintains agent-specific destinations and update/remove workflows outside this repository.
