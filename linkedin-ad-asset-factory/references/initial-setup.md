# Initial Setup (Any Compatible Harness)

Use this reference on the first invocation or when preflight reports a failed prerequisite.

## What the preflight checks

Run:

```text
python scripts/preflight.py --json
```

It reports, without exposing secret values:

- the current skill directory and optional `FACTORY_ROOT`;
- whether `OPENAI_API_KEY` is present in the current harness process;
- whether a supplied `FACTORY_ROOT` exists.

## Install for a harness

From a clone of this repository, run:

```text
python setup.py
```

Target a supported host with `python setup.py --host codex`, `claude`, `cursor`, `opencode`, `factory`, or `kiro`. Use `python setup.py --skills-dir <directory>` for any other harness that reads Agent Skills folders. The installer does not overwrite an unmanaged destination unless the user passes `--force`.

Restart the selected harness (or start a new task) so it discovers the skill.

## Set an OpenAI API key yourself

An API key is required only for real image generation. Do not paste it into agent chat, source files, a Google Doc, or any generated artifact.

1. Create or manage a key in the [OpenAI API key dashboard](https://platform.openai.com/api-keys).
2. In PowerShell, save it for your Windows user without echoing it:

   ```powershell
   $key = Read-Host "Paste your OpenAI API key"
   [Environment]::SetEnvironmentVariable("OPENAI_API_KEY", $key, "User")
   Remove-Variable key
   ```

3. Completely restart the harness so its process receives the new environment variable.
4. Invoke this skill again; preflight will report only whether the key is available.

For a one-terminal test that does not persist the key, use:

```powershell
$env:OPENAI_API_KEY = Read-Host "Paste your OpenAI API key"
```

That value lasts only for the current terminal process. Never run a command that prints `$env:OPENAI_API_KEY`.

On macOS/Linux, a one-session setup is:

```bash
read -rs OPENAI_API_KEY
export OPENAI_API_KEY
printf '\n'
```

Launch the harness from that same terminal. For persistent storage, prefer an OS or organization secret manager; a gitignored `.env` is acceptable only when the factory explicitly supports it. Never commit an `.env` file.

## Dry-run without a key

The factory can still ingest inputs, plan variants, write structured briefs, and run the copy audit without an API key. Keep `dry_run: true`; do not start image generation until preflight confirms the key is present and the user explicitly approves paid generation.
