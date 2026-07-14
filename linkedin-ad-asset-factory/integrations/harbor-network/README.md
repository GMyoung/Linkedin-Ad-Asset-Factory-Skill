# Harbor Network

Harbor Network is an interactive professional-network home feed created for Harvey Yang. The LinkedIn Ad Asset Factory bundles this project as its default local preview target: each launch syncs five generated ads, starts a local server, and exposes the ordinary sponsored feed posts with per-ad Modify controls.

The dry-run plan remains internal campaign data; the feed does not expose audit panels, taxonomy labels, generated badges, or a separate campaign header. Post copy, image, headline, and CTA use the normal feed presentation. Modify accepts a natural-language change request plus optional image or text references, and a successful revision appears beside the original. Sites publishing is optional and requires an explicit user request; hosted revisions require the Sites `OPENAI_API_KEY` secret and the logical `AD_ASSETS` R2 binding.

## Run locally

```bash
npm install
npm run dev
```

Validate a production build with:

```bash
npm run build
```

## License

The original source code in this repository is licensed under the [MIT License](LICENSE).

## Assets and names

The MIT license applies to the original source code only. It does not grant rights to:

- user-provided portraits or photographs;
- externally sourced images, which remain subject to their original source terms; or
- third-party names, logos, trademarks, or service marks.

Harbor Network is a fictional project and is not affiliated with LinkedIn.
