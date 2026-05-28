import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Woven",
    short_name: "Woven",
    description: "Minimal clothing essentials in Pakistan across Classic, Summer, and Winter.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f4f0e9",
    theme_color: "#f4f0e9",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
