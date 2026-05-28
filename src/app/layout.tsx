import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Woven | Ideas Stitched Into Reality",
  description: "Theme-led clothing collections across Classic, Summer, and Winter.",
  openGraph: {
    title: "Woven | Ideas Stitched Into Reality",
    description: "Plain essentials, summer pieces, formal edits, and winter layers by Woven.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=DM+Mono&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400;1,9..40,500;1,9..40,700&family=IBM+Plex+Mono&family=Permanent+Marker&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Rajdhani:wght@400;700&family=Space+Grotesk:wght@400;700&family=Syne:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
