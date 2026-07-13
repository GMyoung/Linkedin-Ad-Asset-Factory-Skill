import { env } from "cloudflare:workers";

type RuntimeEnv = { AD_ASSETS?: R2Bucket };

export async function GET(
  _request: Request,
  context: { params: Promise<{ key: string[] }> },
) {
  const runtime = env as unknown as RuntimeEnv;
  if (!runtime.AD_ASSETS) return new Response("Revision storage is unavailable.", { status: 503 });

  const { key: segments } = await context.params;
  const key = segments.join("/");
  if (!key.startsWith("revisions/")) return new Response("Not found", { status: 404 });

  const object = await runtime.AD_ASSETS.get(key);
  if (!object) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  return new Response(object.body, { headers });
}
