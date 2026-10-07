import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Image optimization ────────────────────────────────────────────────────────
  // Remote patterns will be added in Phase 6 when Supabase Storage is configured.
  // Cloudinary patterns can also be added here if needed.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
