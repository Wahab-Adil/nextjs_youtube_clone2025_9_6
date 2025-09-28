import { db } from "@/db";
import { eq } from "drizzle-orm";
import { videos } from "@/db/schema";
import { headers } from "next/headers";
import {
  VideoAssetCreatedWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetTrackReadyWebhookEvent,
  VideoAssetReadyWebhookEvent,
  VideoAssetDeletedWebhookEvent,
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
    | VideoAssetReadyWebhookEvent
    | VideoAssetDeletedWebhookEvent;

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
      console.log("created", data.upload_id);
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

      console.log(data, "ready");
      if (!playBackId) {
        return new Response("Missing PlayBack Id", { status: 400 });
      }

      const thumbnailUrl = `https://image.mux.com/${playBackId}/thumbnail.jpg`;
      const previewUrl = `https://image.mux.com/${playBackId}/animated.gif`;
      const duration = data.duration ? Math.round(data.duration * 1000) : 0;

      const uploadId = data?.upload_id;
      console.log("ready", data.upload_id);
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
          previewUrl,
          duration: duration,
        })
        .where(eq(videos.muxUploadId, uploadId));

      break;
    }

    case "video.asset.errored": {
      const data = (payload as VideoAssetErroredWebhookEvent).data;
      if (!data.upload_id) break;
      console.log("errored", data.upload_id);
      await db
        .update(videos)
        .set({ muxStatus: data.status })
        .where(eq(videos.muxUploadId, data.upload_id));

      break;
    }

    case "video.asset.deleted": {
      const data = (payload as VideoAssetDeletedWebhookEvent).data;
      console.log("deleted", data);
      if (!data.upload_id) break;

      await db.delete(videos).where(eq(videos.muxUploadId, data.upload_id));

      break;
    }

    case "video.asset.track.ready": {
      const data = payload as VideoAssetTrackReadyWebhookEvent["data"] & {
        asset_id: string;
      };

      const assetId = data.asset_id;
      const trackId = data.id;
      const status = data.status;

      if (!data) {
        return new Response("Missing Asset ID", { status: 400 });
      }

      await db
        .update(videos)
        .set({
          muxTrackId: trackId,
          muxTrackStatus: status,
        })
        .where(eq(videos.muxAssetId, assetId));

      break;
    }

    default:
      break;
  }
  return new Response("OK", { status: 200 });
};
