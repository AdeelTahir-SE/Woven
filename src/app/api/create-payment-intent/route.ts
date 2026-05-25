import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe. We use a mock or environment variable if available.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2026-04-22.dahlia",
});

export async function POST(request: Request) {
  try {
    const { items } = await request.json();
    
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
    // If it fails (e.g., invalid test key), return a mock secret so the UI doesn't crash completely.
    return NextResponse.json({
      clientSecret: "pi_mock_secret",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
