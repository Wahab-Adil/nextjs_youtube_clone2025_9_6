import { db } from "@/db";
import { eq } from "drizzle-orm";
import { videos } from "@/db/schema";
import { headers } from "next/headers";
import {
  VideoAssetCreatedWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetTrackReadyWebhookEvent,
  VideoAssetReadyWebhookEvent,
} from "@mux/mux-node/resources/webhooks";
import { mux } from "@/lib/mux";

export const POST = async (request: Request) => {
  if (!process.env.MUX_WEBHOOK_SECRET) {
    throw new Error("MUX_WEBHOOK_SECRET is not set");
  }

  type WEBHOOKEvent =
    | VideoAssetCreatedWebhookEvent
    | VideoAssetErroredWebhookEvent
    | VideoAssetTrackReadyWebhookEvent
    | VideoAssetReadyWebhookEvent;

  const headerList = await headers();
  const muxSignature = headerList.get("mux-signature");

  if (!muxSignature) {
    return new Response("No signature found", { status: 401 });
  }
  const payload = await request.json();
  const body = JSON.stringify(payload);

  mux.webhooks.verifySignature(
    body,
    { "mux-signature": muxSignature },
    process.env.MUX_WEBHOOK_SECRET
  );

  switch ((payload as WEBHOOKEvent).type) {
    case "video.asset.created": {
      const data = (payload as VideoAssetCreatedWebhookEvent).data;
      if (!data.upload_id) {
        return new Response("No Upload Id", { status: 400 });
      }

      await db
        .update(videos)
        .set({ muxAssetId: data.id, muxStatus: data.status })
        .where(eq(videos.muxUploadId, data.upload_id));

      break;
    }
    case "video.asset.ready": {
      const data = (payload as VideoAssetReadyWebhookEvent).data;
      const playBackId = data?.playback_ids?.[0].id;
      console.log("playid", playBackId);
      if (!playBackId) {
        return new Response("Missing PlayBack Id", { status: 400 });
      }

      const thumbnailUrl = `https://image.mux.com/${playBackId}/thumbnail.jpg`;
      console.log("y", thumbnailUrl);

      const uploadId = data?.upload_id;
      if (!uploadId) {
        return new Response("Upload Id is Missing", { status: 400 });
      }

      await db
        .update(videos)
        .set({
          muxStatus: data.status,
          muxPlaybackId: playBackId,
          muxAssetId: data?.id,
          thumbnailUrl: thumbnailUrl,
        })
        .where(eq(videos.muxUploadId, uploadId));

      break;
    }
    default:
      break;
  }
  return new Response("OK", { status: 200 });
};
