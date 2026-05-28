import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function isValidSignature(body: string, signature: string) {
  if (!process.env.SAFEPAY_SECRET_KEY || !signature) {
    return false;
  }

  const expected = createHmac("sha256", process.env.SAFEPAY_SECRET_KEY).update(body).digest("hex");
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);

  return expectedBuffer.length === signatureBuffer.length && timingSafeEqual(expectedBuffer, signatureBuffer);
}

async function patchTable(table: string, query: string, body: unknown) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return;
  }

  await fetch(`${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${table}?${query}`, {
    method: "PATCH",
    headers: {
      apikey: SUPABASE_KEY,
      authorization: `Bearer ${SUPABASE_KEY}`,
      "content-type": "application/json",
      prefer: "return=minimal",
    },
    body: JSON.stringify(body),
  });
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-sfpy-signature") ?? "";

  if (!isValidSignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);
  const eventType = event?.type;
  const data = event?.data ?? {};
  const orderId = data.order_id ?? data.orderId;
  const trackerToken = data.tracker?.token ?? data.tracker_token;

  if (eventType === "payment:created" && orderId) {
    await Promise.all([
      patchTable("orders", `id=eq.${encodeURIComponent(orderId)}`, { status: "paid" }),
      trackerToken
        ? patchTable("payments", `order_id=eq.${encodeURIComponent(orderId)}`, {
            provider: "safepay",
            provider_reference: trackerToken,
            status: "authorized",
          })
        : Promise.resolve(),
    ]);
  }

  return NextResponse.json({ received: true });
}
