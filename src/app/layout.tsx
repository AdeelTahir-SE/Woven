import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "@/components/woven-client";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-body",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://woven.pk"),
  title: {
    default: "Woven Clothing Pakistan - Minimal Everyday Essentials",
    template: "%s - Woven",
  },
  description:
    "Shop Woven clothing in Pakistan: minimal everyday essentials across cotton t-shirts, pants, shirts, formal layers, hoodies, jackets, sets, and winter accessories.",
  keywords: [
    "Woven clothing",
    "clothing brand Pakistan",
    "minimal clothing Pakistan",
    "cotton t shirts Pakistan",
    "hoodies Pakistan online",
    "jackets Pakistan online",
    "formal waistcoat Pakistan",
    "everyday essentials clothing",
    "Woven Pakistan",
  ],
  authors: [{ name: "Woven", url: "https://woven.pk" }],
  creator: "Woven",
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "https://woven.pk",
    siteName: "Woven",
    title: "Woven Clothing Pakistan - Minimal Everyday Essentials",
    description: "Cotton tees, pants, shirts, formal layers, hoodies, jackets, and seasonal essentials by Woven.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Woven wordmark" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@wovenpk",
    creator: "@wovenpk",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#f4f0e9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-PK" data-scroll-behavior="smooth" className={`${cormorant.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <head>
        <link
          rel="preload"
          as="image"
          href="https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=90&w=2200&auto=format&fit=crop"
        />
      </head>
      <body className="antialiased">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
