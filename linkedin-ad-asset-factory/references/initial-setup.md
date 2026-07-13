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

1. Open the [OpenAI API key dashboard](https://platform.openai.com/api-keys), sign in, and create a new secret key. Keep the browser page private; do not paste the key into agent chat, a repository, or a `.env` file that is tracked by Git.
2. In PowerShell, save it for your Windows user without displaying what you paste:

   ```powershell
   $secureKey = Read-Host "Paste your OpenAI API key" -AsSecureString
   $key = [System.Net.NetworkCredential]::new('', $secureKey).Password
   [Environment]::SetEnvironmentVariable("OPENAI_API_KEY", $key, "User")
   Remove-Variable key, secureKey
   ```

3. Completely restart the harness so its process receives the new environment variable.
4. Invoke this skill again; preflight will report only whether the key is available.

## Required first-setup guidance from the agent

When preflight reports that `OPENAI_API_KEY` is absent, the agent must provide the four steps above in the same response. It must say that the user should set the key locally, restart Codex, then resume the original URL or file request. It must not merely report that the variable is missing, ask the user to reveal the value, or proceed as if five real images were created.

For a one-terminal test that does not persist the key, use:

```powershell
$secureKey = Read-Host "Paste your OpenAI API key" -AsSecureString
$env:OPENAI_API_KEY = [System.Net.NetworkCredential]::new('', $secureKey).Password
Remove-Variable secureKey
```

That value lasts only for the current terminal process. Never run a command that prints `$env:OPENAI_API_KEY`.

On macOS/Linux, a one-session setup is:

```bash
read -rs OPENAI_API_KEY
export OPENAI_API_KEY
printf '\n'
```

Launch the harness from that same terminal. For persistent storage, prefer an OS or organization secret manager; a gitignored `.env` is acceptable only when the factory explicitly supports it. Never commit an `.env` file.

## Launch requirement

The factory can ingest inputs and write copy artifacts without an API key, but the default experience is incomplete until five real images exist. Once preflight confirms the key is present, any supplied URL or file launches the copy plan, five-image generation, Harbor sync, build, and deployment without a second approval step. User-supplied brand assets do not need separate authorization.
