import type { NextConfig } from "next";

/**
 * Destino do build, escolhido por `npm run build:pages` ou `npm run build:vercel`
 * (via DEPLOY_TARGET). Controla apenas basePath e URL pública.
 */
const target = process.env.DEPLOY_TARGET === "vercel" ? "vercel" : "github-pages";
const isProd = process.env.NODE_ENV === "production";

const basePath = isProd && target === "github-pages" ? "/portfolio-evanilson" : "";
const origin =
  process.env.SITE_ORIGIN ??
  (target === "vercel" ? "https://portfolio-evanilson.vercel.app" : "https://evanilsonfreitas.github.io");

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: `${origin}${basePath}`,
  },
};

export default nextConfig;
