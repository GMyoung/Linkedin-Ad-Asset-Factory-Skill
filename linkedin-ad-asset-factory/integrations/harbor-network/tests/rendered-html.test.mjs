import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

test("keeps Harbor Network metadata and renders generated ads as standard feed posts", async () => {
  const [layout, page, feed] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/GeneratedAdFeed.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /Harvey Yang \| Harbor Network/);
  assert.doesNotMatch(page, /<GeneratedAdFeed \/>/);
  for (const startAt of [0, 1, 2, 3, 4]) {
    assert.match(page, new RegExp(`<GeneratedAdFeed startAt=\\{${startAt}\\} limit=\\{1\\} \\/>`));
  }
  assert.match(page, /<GeneratedAdFeed startAt=\{5\} \/>/);
  assert.match(feed, /className="card postCard generatedAdCard"/);
  assert.match(feed, /className="postHeader"/);
  assert.match(feed, /className="postText"/);
  assert.match(feed, /className="adCaption"/);
  assert.doesNotMatch(feed, /Dry-run copy/);
  assert.doesNotMatch(feed, /campaignHeader/);
  assert.doesNotMatch(feed, /generatedBadge/);
  assert.match(feed, /Modify/);
  assert.match(feed, /campaign\.ads\.slice\(startAt, limit === undefined \? undefined : startAt \+ limit\)/);
});

test("ships five generated ads and the revision controls", async () => {
  const [data, css, feed, reviseRoute, files] = await Promise.all([
    readFile(new URL("../app/generated-ads.json", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/GeneratedAdFeed.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/revise/route.ts", import.meta.url), "utf8"),
    readdir(new URL("../public/generated-ads/", import.meta.url)),
  ]);

  const payload = JSON.parse(data);
  assert.equal(payload.ads.length, 5);
  assert.equal(files.filter((name) => /\.(png|jpe?g|webp)$/i.test(name)).length, 5);
  assert.match(feed, /> Modify<\/button>/);
  assert.match(feed, /MessageSquare/);
  assert.match(feed, /type="file"/);
  assert.match(feed, /revisionViewer/);
  assert.match(feed, /revisionNavPrevious/);
  assert.match(feed, /revisionNavNext/);
  assert.match(feed, /ArrowLeft/);
  assert.match(feed, /ArrowRight/);
  assert.match(feed, /Original/);
  assert.match(feed, /New/);
  assert.match(css, /\.revisionViewer/);
  assert.match(css, /\.revisionControls/);
  assert.doesNotMatch(css, /\.generatedAdMedia\.hasRevision/);
  assert.doesNotMatch(css, /grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(reviseRoute, /ASSETS\?: Fetcher/);
  assert.match(reviseRoute, /runtime\.ASSETS\.fetch\(new Request\(new URL\(originalImage, request\.url\)\)\)/);
  assert.doesNotMatch(reviseRoute, /await fetch\(new URL\(originalImage, request\.url\)\)/);
  await access(new URL("../app/api/revise/route.ts", import.meta.url));
});

test("keeps every shared Avatar instance square and circular", async () => {
  const [page, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /className=\{\["avatarImage", className\]/);
  assert.match(page, /style=\{\{ width: size, height: size, flex:/);
  assert.match(css, /\.avatarImage\s*\{[^}]*aspect-ratio:\s*1\s*\/\s*1;/s);
  assert.match(css, /\.avatarImage\s*\{[^}]*border-radius:\s*50%;/s);
  assert.match(css, /\.avatarImage\s*\{[^}]*object-fit:\s*cover;/s);
});
