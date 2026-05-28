import { NextResponse } from "next/server";

const SAFEPAY_BASE =
  process.env.SAFEPAY_ENVIRONMENT === "production"
    ? "https://api.getsafepay.com"
    : "https://sandbox.api.getsafepay.com";

const SAFEPAY_CHECKOUT =
  process.env.SAFEPAY_ENVIRONMENT === "production"
    ? "https://checkout.getsafepay.com"
    : "https://sandbox.checkout.getsafepay.com";

export async function POST(request: Request) {
  const { amount, orderId, customerEmail } = (await request.json()) as {
    amount?: number;
    orderId?: string;
    customerEmail?: string;
  };

  if (!amount || !orderId) {
    return NextResponse.json({ error: "Missing required Safepay checkout fields." }, { status: 400 });
  }

  if (!process.env.SAFEPAY_API_KEY || !process.env.SAFEPAY_SECRET_KEY) {
    return NextResponse.json({ error: "Safepay credentials are not configured." }, { status: 503 });
  }

  try {
    const trackerResponse = await fetch(`${SAFEPAY_BASE}/order/v1/init/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-SFPY-MERCHANT-SECRET": process.env.SAFEPAY_SECRET_KEY,
      },
      body: JSON.stringify({
        merchant_api_key: process.env.SAFEPAY_API_KEY,
        intent: "CYBERSOURCE",
        mode: "payment",
        currency: "PKR",
        amount: Math.round(amount * 100),
      }),
    });

    if (!trackerResponse.ok) {
      return NextResponse.json({ error: "Safepay tracker creation failed." }, { status: trackerResponse.status });
    }

    const trackerPayload = await trackerResponse.json();
    const trackerToken = trackerPayload?.data?.tracker?.token;

    if (!trackerToken) {
      return NextResponse.json({ error: "Safepay did not return a tracker token." }, { status: 502 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://woven.pk";
    const params = new URLSearchParams({
      env: process.env.SAFEPAY_ENVIRONMENT ?? "sandbox",
      tracker: trackerToken,
      source: "custom",
      order_id: orderId,
      redirect_url: `${siteUrl}/checkout/confirm`,
      cancel_url: `${siteUrl}/checkout/payment`,
    });

    if (customerEmail) {
      params.set("email", customerEmail);
    }

    return NextResponse.json({
      checkoutUrl: `${SAFEPAY_CHECKOUT}/embedded/?${params.toString()}`,
      trackerToken,
    });
  } catch {
    return NextResponse.json({ error: "Payment initialization failed." }, { status: 500 });
  }
}
