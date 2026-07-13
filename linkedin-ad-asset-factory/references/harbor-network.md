# Harbor Network Publishing

Use this reference after every successful five-image launch and for the deployed revision experience.

## Bundled site

The skill bundles the Harbor Network Sites project at:

```text
integrations/harbor-network
```

Keep its `.openai/hosting.json`, package manager, lockfile, application structure, and Sites deployment contract intact.

## Automatic launch handoff

After a usable URL or file is supplied and `OPENAI_API_KEY` is present:

1. Produce the dry-run copy artifacts without pausing for approval.
2. Generate exactly five real image assets from the available source material.
3. Run:

   ```powershell
   python scripts/sync_harbor_campaign.py --run-root <RUN_ROOT>
   ```

4. Build `integrations/harbor-network` with its existing `npm run build` command.
5. Use the Sites hosting workflow to save and deploy the validated site automatically.
6. Report the deployed URL, five image paths, and the source run. Do not stop at a local preview.

The sync script copies the five images into `public/generated-ads/` and writes `app/generated-ads.json` from `on_image_text_plan.json`. Keep the complete dry-run plan in data for provenance, but render only the post text, image, headline, and CTA through Harbor's existing sponsored-post layout. Do not show a dry-run panel, campaign header, generated badge, pattern/visual label, or workflow metadata.

## Modify experience

Each deployed generated-ad card must match the existing Harbor/LinkedIn-style post structure. Keep Like and Send unchanged and replace only Comment with Modify. The Modify panel accepts a natural-language change request plus optional image or text reference files. Submit only the selected ad, the request, and its references to the revision endpoint. Keep other ads unchanged.

The revision endpoint must automatically retrieve that selected original from Harbor's internal static-asset binding. Do not require users to upload the original ad again, and do not read it by making an HTTP request back to the private Site URL; that request does not carry the viewer's site authorization.

The new candidate must preserve the original image and source copy, but appear in one full-size revision viewer rather than beside the original. Give the viewer explicit Original and New labels plus visible left/right controls; support keyboard left/right arrows when it has focus. Store generated revision bytes in the Harbor R2 binding and return a stable site URL.

The hosted site needs:

- Sites runtime secret `OPENAI_API_KEY`;
- logical R2 binding `AD_ASSETS` from `.openai/hosting.json`.

Never put the key in source, `.openai/hosting.json`, generated JSON, logs, reports, or tool records.

## Failure behavior

- If there is no usable URL or file, ask for one.
- If `OPENAI_API_KEY` is missing, stop before real generation and explain only how to configure it.
- If a source is partially readable, use the readable material and conservative copy instead of requesting more campaign fields.
- If the site build or deployment fails, keep the generated run intact and report the exact failed stage.
