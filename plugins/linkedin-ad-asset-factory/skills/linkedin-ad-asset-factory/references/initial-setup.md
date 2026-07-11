# Initial Codex Setup

Use this reference on the first invocation or when preflight reports a failed prerequisite.

## What the bootstrap checks

Run:

```powershell
python ../../scripts/bootstrap_codex.py --check-only --json
```

It reports, without exposing secret values:

- whether the `codex` CLI is available;
- whether this plugin is installed and enabled from its local marketplace;
- whether `OPENAI_API_KEY` is present in the current Codex process;
- whether a supplied `FACTORY_ROOT` exists.

## Install the local Codex plugin

From a clone of this repository, run:

```powershell
python .\plugins\linkedin-ad-asset-factory\scripts\bootstrap_codex.py --install-plugin --json
```

The bootstrap registers this repository as the `linkedin-ad-asset-factory` marketplace when necessary, then installs the bundled plugin. It is idempotent: it refuses to overwrite a marketplace with the same name from a different location.

After installation, start a new Codex task so the new plugin skill is loaded.

## Set an OpenAI API key yourself

An API key is required only for real image generation. Do not paste it into Codex chat, source files, a Google Doc, or any generated artifact.

1. Create or manage a key in the [OpenAI API key dashboard](https://platform.openai.com/api-keys).
2. In PowerShell, save it for your Windows user without echoing it:

   ```powershell
   $key = Read-Host "Paste your OpenAI API key"
   [Environment]::SetEnvironmentVariable("OPENAI_API_KEY", $key, "User")
   Remove-Variable key
   ```

3. Completely restart Codex so its process receives the new environment variable.
4. Invoke this skill again; preflight will report only whether the key is available.

For a one-terminal test that does not persist the key, use:

```powershell
$env:OPENAI_API_KEY = Read-Host "Paste your OpenAI API key"
```

That value lasts only for the current terminal process. Never run a command that prints `$env:OPENAI_API_KEY`.

## Dry-run without a key

The factory can still ingest inputs, plan variants, write structured briefs, and run the copy audit without an API key. Keep `dry_run: true`; do not start image generation until preflight confirms the key is present and the user explicitly approves paid generation.
