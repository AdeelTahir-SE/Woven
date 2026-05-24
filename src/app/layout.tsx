import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Woven | Ideas Stitched Into Reality",
  description:
    "University Edition SS25 clothing collections for campus life, creative students, and limited drops.",
  openGraph: {
    title: "Woven | Ideas Stitched Into Reality",
    description:
      "Minimal, streetwise, academic, and digital clothing collections for university students.",
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
