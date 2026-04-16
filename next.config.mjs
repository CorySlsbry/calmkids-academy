/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // NOTE: Static export (`output: 'export'`) is incompatible with the app's server-side
  // API routes (Supabase, Stripe webhooks, etc.). For the Android/Capacitor build we
  // point Capacitor at the deployed Vercel URL instead of a local static bundle.
  // See capacitor.config.ts → server.url and PLAY_STORE_DEPLOYMENT.md.

  images: {
    // Keep unoptimized so the same build can be served from both Vercel and
    // the Capacitor WebView without a separate image-optimization server.
    unoptimized: true,
  },

  trailingSlash: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
