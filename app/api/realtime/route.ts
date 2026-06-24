import { NextRequest } from "next/server";
import { registerClient, unregisterClient } from "@/lib/realtime";

export async function GET(req: NextRequest) {
  const id = Math.random().toString(36).substring(7);
  let intervalId: NodeJS.Timeout;

  const stream = new ReadableStream({
    start(controller) {
      registerClient(id, controller);

      // Send initial connection confirmation
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode(`event: connected\ndata: ${JSON.stringify({ id })}\n\n`));

      // Periodic ping (every 20 seconds) to prevent gateway timeout
      intervalId = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`event: ping\ndata: "keep-alive"\n\n`));
        } catch (e) {
          clearInterval(intervalId);
          unregisterClient(id);
        }
      }, 20000);
    },
    cancel() {
      if (intervalId) clearInterval(intervalId);
      unregisterClient(id);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
export const dynamic = "force-dynamic";
