"use client";

import { FormEvent, KeyboardEvent, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ImagePlus, LoaderCircle, MessageSquare, MoreHorizontal, Paperclip, Send, ThumbsUp } from "lucide-react";
import campaignPayload from "./generated-ads.json";

type GeneratedAd = {
  asset_id: string;
  image: string;
  headline: string;
  post_text: string;
  cta: string;
};

type CampaignPayload = {
  campaign: {
    title: string;
    generated_at: string | null;
    source_run: string | null;
    asset_count: number;
  };
  ads: GeneratedAd[];
};

const campaign = campaignPayload as CampaignPayload;

function GeneratedAdCard({ ad, sponsor }: { ad: GeneratedAd; sponsor: string }) {
  const [liked, setLiked] = useState(false);
  const [editing, setEditing] = useState(false);
  const [request, setRequest] = useState("");
  const [references, setReferences] = useState<File[]>([]);
  const [revisedImage, setRevisedImage] = useState<string | null>(null);
  const [revisionView, setRevisionView] = useState<"original" | "revised">("original");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const reactionCount = 48 + Number(ad.asset_id.replace(/\D/g, "") || 0) * 17 + (liked ? 1 : 0);

  const referenceLabel = useMemo(() => {
    if (!references.length) return "Add reference files";
    if (references.length === 1) return references[0].name;
    return `${references.length} reference files`;
  }, [references]);

  async function submitRevision(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!request.trim() || busy) return;
    setBusy(true);
    setError("");

    const form = new FormData();
    form.set("asset_id", ad.asset_id);
    form.set("original_image", ad.image);
    form.set("request", request.trim());
    form.set("headline", ad.headline);
    references.forEach((file) => form.append("references", file));

    try {
      const response = await fetch("/api/revise", { method: "POST", body: form });
      const result = await response.json() as { image_url?: string; error?: string };
      if (!response.ok || !result.image_url) {
        throw new Error(result.error || "The revision could not be generated.");
      }
      setRevisedImage(result.image_url);
      setRevisionView("revised");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "The revision could not be generated.");
    } finally {
      setBusy(false);
    }
  }

  const viewingRevision = Boolean(revisedImage && revisionView === "revised");
  const visibleImage = viewingRevision ? revisedImage! : ad.image;
  const visibleLabel = viewingRevision ? "New" : "Original";

  function handleViewerKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!revisedImage) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setRevisionView("original");
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setRevisionView("revised");
    }
  }

  return (
    <article className="card postCard generatedAdCard" data-asset-id={ad.asset_id}>
      <header className="postHeader">
        <div className="generatedAdBrand" aria-hidden="true">{sponsor.slice(0, 1).toUpperCase()}</div>
        <div className="postIdentity">
          <h2>{sponsor} <span>· Sponsored</span></h2>
          <p>Promoted</p>
          <p>Sponsored · <span aria-label="Visible to anyone">◉</span></p>
        </div>
        <button className="iconButton" type="button" aria-label="More post actions"><MoreHorizontal size={21} /></button>
      </header>

      <div className="postText">
        <p>{ad.post_text}</p>
      </div>

      <div className="generatedAdMedia">
        {revisedImage ? (
          <div className="revisionViewer" role="group" aria-label={`Compare original and new versions of ${ad.headline}`} tabIndex={0} onKeyDown={handleViewerKeyDown}>
            <figure className="revisionFrame">
              <figcaption>{visibleLabel}</figcaption>
              <img src={visibleImage} alt={`${ad.headline} ${visibleLabel.toLowerCase()} advertisement`} />
              <button className="revisionNav revisionNavPrevious" type="button" aria-label="Show original version" onClick={() => setRevisionView("original")} disabled={!viewingRevision}><ChevronLeft size={22} /></button>
              <button className="revisionNav revisionNavNext" type="button" aria-label="Show new version" onClick={() => setRevisionView("revised")} disabled={viewingRevision}><ChevronRight size={22} /></button>
            </figure>
            <div className="revisionControls" aria-label="Revision version selector">
              <button className={!viewingRevision ? "selected" : ""} type="button" aria-pressed={!viewingRevision} onClick={() => setRevisionView("original")}>Original</button>
              <span aria-live="polite">{visibleLabel} of 2</span>
              <button className={viewingRevision ? "selected" : ""} type="button" aria-pressed={viewingRevision} onClick={() => setRevisionView("revised")}>New</button>
            </div>
          </div>
        ) : (
          <figure>
            <img src={ad.image} alt={`${ad.headline} advertisement`} />
          </figure>
        )}
      </div>

      <div className="adCaption">
        <div><b>{ad.headline}</b><span>harbor-network.example</span></div>
        <button type="button">{ad.cta || "Learn more"}</button>
      </div>

      <div className="engagementRow">
        <span className="reactionSummary"><i>👍</i><i>💡</i><i>♥</i>{reactionCount}</span>
        <span>4 reposts</span>
      </div>

      <div className="postActions">
        <button className={liked ? "liked" : ""} type="button" onClick={() => setLiked((value) => !value)}><ThumbsUp size={19} fill={liked ? "currentColor" : "none"} /> Like</button>
        <button type="button" onClick={() => setEditing((value) => !value)} aria-expanded={editing}><MessageSquare size={19} /> Modify</button>
        <button type="button"><Send size={19} /> Send</button>
      </div>

      {editing && (
        <form className="modifyPanel" onSubmit={submitRevision}>
          <textarea aria-label="Describe the change" id={`request-${ad.asset_id}`} value={request} onChange={(event) => setRequest(event.target.value)} placeholder="Describe a change to this ad…" />
          <div className="modifyControls">
            <label className="referencePicker"><Paperclip size={17} /><span>{referenceLabel}</span><input type="file" multiple accept="image/png,image/jpeg,image/webp,text/plain,text/markdown,.md,.txt" onChange={(event) => setReferences(Array.from(event.target.files || []))} /></label>
            <button type="submit" disabled={!request.trim() || busy}>{busy ? <><LoaderCircle className="spin" size={17} /> Generating</> : <><ImagePlus size={17} /> Generate revision</>}</button>
          </div>
          {error && <p className="modifyError" role="alert">{error}</p>}
        </form>
      )}
    </article>
  );
}

type GeneratedAdFeedProps = {
  startAt?: number;
  limit?: number;
};

export default function GeneratedAdFeed({ startAt = 0, limit }: GeneratedAdFeedProps) {
  const ads = campaign.ads.slice(startAt, limit === undefined ? undefined : startAt + limit);
  if (!ads.length) return null;
  const sponsor = campaign.campaign.title.split(/\s+/)[0] || "Sponsored post";

  return (
    <section className="generatedCampaign" aria-label="Sponsored posts">
      {ads.map((ad) => <GeneratedAdCard ad={ad} sponsor={sponsor} key={ad.asset_id} />)}
    </section>
  );
}
