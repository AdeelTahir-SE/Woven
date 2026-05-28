import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type CheckoutItem = {
  productSlug: string;
  name: string;
  pricePkr: number;
  quantity: number;
  size: string;
};

type CheckoutPayload = {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: "cod" | "bank_transfer" | "safepay";
  card?: {
    holder?: string;
    last4?: string;
    brand?: string;
    expiry?: string;
  };
  providerReference?: string;
  items: CheckoutItem[];
};

function hasSupabaseConfig() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

function supabaseUrl(table: string) {
  return `${SUPABASE_URL?.replace(/\/$/, "")}/rest/v1/${table}`;
}

async function insertRow(table: string, body: unknown) {
  const response = await fetch(supabaseUrl(table), {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY ?? "",
      authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "content-type": "application/json",
      prefer: "return=minimal",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Supabase insert into ${table} failed with ${response.status}.`);
  }

  return response;
}

function isValidPayload(payload: Partial<CheckoutPayload>): payload is CheckoutPayload {
  const hasCheckoutDetails = Boolean(
    payload.customerName &&
      payload.email &&
      payload.phone &&
      payload.address &&
      payload.city &&
      payload.paymentMethod &&
      Array.isArray(payload.items) &&
      payload.items.length > 0,
  );

  if (!hasCheckoutDetails) {
    return false;
  }

  if (payload.paymentMethod !== "safepay") {
    return true;
  }

  return Boolean(payload.providerReference || payload.card);
}

function getOrderStatus(paymentMethod: CheckoutPayload["paymentMethod"]) {
  if (paymentMethod === "cod") return "pay_on_delivery";
  if (paymentMethod === "safepay") return "pending_payment";
  return "pending_payment";
}

function getPaymentStatus(paymentMethod: CheckoutPayload["paymentMethod"]) {
  if (paymentMethod === "cod") return "pay_on_delivery";
  if (paymentMethod === "safepay") return "pending";
  return "pending";
}

function getProviderReference(payload: CheckoutPayload) {
  if (payload.paymentMethod !== "safepay" || !payload.card) {
    return payload.providerReference ?? null;
  }

  const brand = payload.card.brand ?? "card";
  return `${brand.toUpperCase()}-${payload.card.last4}`;
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<CheckoutPayload>;

  if (!isValidPayload(payload)) {
    return NextResponse.json({ error: "Missing checkout details." }, { status: 400 });
  }

  const subtotal = payload.items.reduce((sum, item) => sum + item.pricePkr * item.quantity, 0);
  const shipping = subtotal > 0 ? 250 : 0;
  const total = subtotal + shipping;

  if (!hasSupabaseConfig()) {
    return NextResponse.json({
      orderId: `LOCAL-${Date.now()}`,
      orderNumber: `LOCAL-${Date.now()}`,
      paymentStatus: getPaymentStatus(payload.paymentMethod),
      totalPkr: total,
    });
  }

  try {
    const orderId = crypto.randomUUID();
    const orderNumber = `WV-${Date.now().toString(36).toUpperCase()}`;

    await insertRow("orders", {
      id: orderId,
      order_number: orderNumber,
      customer_name: payload.customerName,
      email: payload.email,
      phone: payload.phone,
      shipping_address: payload.address,
      shipping_city: payload.city,
      subtotal_pkr: subtotal,
      shipping_pkr: shipping,
      total_pkr: total,
      status: getOrderStatus(payload.paymentMethod),
    });

    await insertRow("order_items", payload.items.map((item) => ({
      order_id: orderId,
      product_slug: item.productSlug,
      product_name: item.name,
      size: item.size,
      quantity: item.quantity,
      unit_price_pkr: item.pricePkr,
      line_total_pkr: item.pricePkr * item.quantity,
    })));

    await insertRow("payments", {
      order_id: orderId,
      provider: payload.paymentMethod,
      status: getPaymentStatus(payload.paymentMethod),
      amount_pkr: total,
      provider_reference: getProviderReference(payload),
    });

    return NextResponse.json({
      orderId,
      orderNumber,
      paymentStatus: getPaymentStatus(payload.paymentMethod),
      totalPkr: total,
    });
  } catch {
    return NextResponse.json({
      error: "Checkout could not be saved. Please run the Supabase checkout SQL and try again.",
    }, { status: 503 });
  }
}
