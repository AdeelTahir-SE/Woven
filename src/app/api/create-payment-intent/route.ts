import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe secret key is not configured." }, { status: 503 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-04-22.dahlia",
  });

  try {
    const { items } = await request.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No checkout items provided." }, { status: 400 });
    }

    // Calculate total
    const subtotal = items.reduce((sum: number, item: { pricePkr: number, quantity: number }) => sum + (item.pricePkr * item.quantity), 0);
    const shipping = subtotal > 0 ? 250 : 0;
    const totalPkr = subtotal + shipping;
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPkr * 100, // Stripe expects amounts in the smallest currency unit (e.g., cents)
      currency: "pkr",
      // In the latest api versions, automatic_payment_methods is enabled by default
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: unknown) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
