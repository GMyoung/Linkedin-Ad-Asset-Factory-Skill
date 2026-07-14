# Harbor Network Local Preview and Optional Publishing

Use this reference after every successful five-image launch and for local or deployed revision experiences.

## Bundled site

The skill bundles the Harbor Network Sites project at:

```text
integrations/harbor-network
```

Keep its `.openai/hosting.json`, package manager, lockfile, application structure, and Sites deployment contract intact.

## Default local launch handoff

After a usable URL or file is supplied and `OPENAI_API_KEY` is present:

1. Produce the dry-run copy artifacts without pausing for approval.
2. Generate exactly five real image assets from the available source material.
3. Run:

   ```powershell
   python scripts/sync_harbor_campaign.py --run-root <RUN_ROOT>
   ```

4. Build `integrations/harbor-network` with its existing `npm run build` command.
5. Start `npm run dev` from `integrations/harbor-network` in a retained/background process.
6. Read the exact local URL printed by the development server, verify it responds, and report that URL, the five image paths, and the source run.

This local handoff is mandatory for every successful launch and must not depend on the Codex Sites connector. Do not assume a fixed port, do not start a duplicate server, and do not end the task before the local URL has been verified. Keep the server alive for the active task unless the user asks to stop it.

## Optional Sites publishing

Use the Sites hosting workflow only when the user explicitly asks to deploy, publish, host online, or use Sites. A successful local preview is the default deliverable; a hosted URL is an additional deliverable, not a replacement for it.

For an explicit publish request, save and deploy the validated site through Sites, then report both the verified local URL and the deployment URL.

The sync script copies the five images into `public/generated-ads/` and writes `app/generated-ads.json` from `on_image_text_plan.json`. Keep the complete dry-run plan in data for provenance, but render only the post text, image, headline, and CTA through Harbor's existing sponsored-post layout. Do not show a dry-run panel, campaign header, generated badge, pattern/visual label, or workflow metadata.

## Modify experience

Each local or deployed generated-ad card must match the existing Harbor/LinkedIn-style post structure. Keep Like and Send unchanged and replace only Comment with Modify. The Modify panel accepts a natural-language change request plus optional image or text reference files. Submit only the selected ad, the request, and its references to the revision endpoint. Keep other ads unchanged.

The revision endpoint must automatically retrieve the selected original from the active Harbor asset source. Do not require users to upload the original ad again. In a hosted Sites environment, use Harbor's internal static-asset binding instead of making an HTTP request back to the private Site URL; that request does not carry the viewer's site authorization.

The new candidate must preserve the original image and source copy, but appear in one full-size revision viewer rather than beside the original. Give the viewer explicit Original and New labels plus visible left/right controls; support keyboard left/right arrows when it has focus. Store generated revision bytes in the Harbor R2 binding and return a stable site URL.

Only an explicitly published hosted site needs:

- Sites runtime secret `OPENAI_API_KEY`;
- logical R2 binding `AD_ASSETS` from `.openai/hosting.json`.

Never put the key in source, `.openai/hosting.json`, generated JSON, logs, reports, or tool records.

## Failure behavior

- If there is no usable URL or file, ask for one.
- If `OPENAI_API_KEY` is missing, stop before real generation and explain only how to configure it.
- If a source is partially readable, use the readable material and conservative copy instead of requesting more campaign fields.
- If the local site build or startup fails, keep the generated run intact and report the exact failed stage. Do not substitute an online deployment.
- If an explicitly requested Sites deployment fails, keep the verified local preview and generated run intact, then report the deployment failure separately.
