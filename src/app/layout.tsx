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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
