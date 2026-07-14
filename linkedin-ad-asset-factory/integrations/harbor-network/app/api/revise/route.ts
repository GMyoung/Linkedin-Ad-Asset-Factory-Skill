import { env } from "cloudflare:workers";

type RuntimeEnv = {
  OPENAI_API_KEY?: string;
  AD_ASSETS?: R2Bucket;
  ASSETS?: Fetcher;
};

type ImageResponse = {
  data?: Array<{ b64_json?: string }>;
  error?: { message?: string };
};

const MAX_REFERENCE_FILES = 4;
const MAX_REFERENCE_BYTES = 12 * 1024 * 1024;

function json(body: unknown, status = 200) {
  return Response.json(body, { status });
}

function decodeBase64(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

export async function POST(request: Request) {
  const runtime = env as unknown as RuntimeEnv;
  if (!runtime.OPENAI_API_KEY) return json({ error: "The hosted image API key is not configured." }, 503);
  if (!runtime.AD_ASSETS) return json({ error: "The hosted revision storage is not configured." }, 503);

  const form = await request.formData();
  const assetId = String(form.get("asset_id") || "").trim();
  const originalImage = String(form.get("original_image") || "").trim();
  const changeRequest = String(form.get("request") || "").trim();
  const headline = String(form.get("headline") || "").trim();
  if (!assetId || !/^asset_[a-zA-Z0-9_-]+$/.test(assetId)) return json({ error: "Invalid asset id." }, 400);
  if (!originalImage.startsWith("/generated-ads/")) return json({ error: "Invalid original image." }, 400);
  if (!changeRequest) return json({ error: "Describe the requested change." }, 400);
  if (!runtime.ASSETS) return json({ error: "The original ad assets are unavailable." }, 503);

  // Do not self-fetch through the private Site URL. The ASSETS binding reads the
  // deployed original directly, so Modify always supplies the selected ad image
  // without asking the user to upload that original again.
  const originalResponse = await runtime.ASSETS.fetch(new Request(new URL(originalImage, request.url)));
  if (!originalResponse.ok) return json({ error: "The original ad image could not be loaded." }, 400);
  const originalBlob = await originalResponse.blob();

  const referenceFiles = form.getAll("references").filter((item): item is File => item instanceof File && item.size > 0);
  if (referenceFiles.length > MAX_REFERENCE_FILES) return json({ error: `Upload at most ${MAX_REFERENCE_FILES} reference files.` }, 400);
  if (referenceFiles.some((file) => file.size > MAX_REFERENCE_BYTES)) return json({ error: "Each reference file must be 12 MB or smaller." }, 400);

  const imageReferences = referenceFiles.filter((file) => file.type.startsWith("image/"));
  const textReferences = referenceFiles.filter((file) => file.type.startsWith("text/") || /\.(md|txt)$/i.test(file.name));
  const referenceText = (await Promise.all(textReferences.map((file) => file.text()))).join("\n\n").slice(0, 12_000);

  const prompt = [
    `Edit only the supplied advertisement for ${assetId}.`,
    `Original headline: ${headline}.`,
    `Requested change: ${changeRequest}`,
    referenceText ? `Reference notes:\n${referenceText}` : "",
    "Preserve the original campaign identity and overall composition unless the request changes them.",
    "Keep all visible text mobile-readable. Do not add unsupported claims, statistics, customer names, logos, awards, or endorsements.",
  ].filter(Boolean).join("\n\n");

  const imageForm = new FormData();
  imageForm.set("model", "gpt-image-2");
  imageForm.set("prompt", prompt);
  imageForm.set("size", "1024x1024");
  imageForm.set("quality", "medium");
  imageForm.set("output_format", "png");
  imageForm.append("image[]", new File([originalBlob], "original.png", { type: originalBlob.type || "image/png" }));
  imageReferences.forEach((file) => imageForm.append("image[]", file));

  const apiResponse = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: { Authorization: `Bearer ${runtime.OPENAI_API_KEY}` },
    body: imageForm,
  });
  const imageResult = await apiResponse.json() as ImageResponse;
  const encoded = imageResult.data?.[0]?.b64_json;
  if (!apiResponse.ok || !encoded) {
    return json({ error: imageResult.error?.message || "The image service did not return a revision." }, apiResponse.status || 502);
  }

  const key = `revisions/${assetId}/${Date.now()}-${crypto.randomUUID()}.png`;
  await runtime.AD_ASSETS.put(key, decodeBase64(encoded), {
    httpMetadata: { contentType: "image/png", cacheControl: "public, max-age=31536000, immutable" },
    customMetadata: { assetId },
  });

  return json({ asset_id: assetId, image_url: `/api/revision/${key}` });
}
