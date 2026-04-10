import type { CapacitorConfig } from "@capacitor/cli";

/**
 * CalmKids Academy — Capacitor Configuration
 *
 * App ID: com.coryslsbry.calmkidsacademy
 * Play Store category: Education / Designed for Families
 * Target audience: Children ages 2–8
 *
 * IMPORTANT KIDS-CATEGORY REQUIREMENTS (Google Play):
 *  - Families Policy: https://play.google.com/about/families/
 *  - COPPA compliance required (no personal data from children <13)
 *  - No behavioral advertising allowed
 *  - Content rating must be "Everyone" or lower
 *  - Data Safety form must be completed in Play Console
 *  - Privacy policy URL must be provided in Play Console
 */
const config: CapacitorConfig = {
  appId: "com.coryslsbry.calmkidsacademy",
  appName: "CalmKids Academy",

  // Next.js output directory (used when building a pure static bundle)
  webDir: "out",

  server: {
    // The app's API routes (Stripe, Supabase) require a running server, so the
    // Android WebView loads the deployed Vercel app rather than a local static bundle.
    // Replace this URL with your production domain once custom domain is configured.
    url: "https://calmkids-academy.vercel.app",

    // Keep androidScheme as "https" so cookies and PWA features work correctly.
    androidScheme: "https",

    // cleartext must remain false in production — no HTTP allowed in kids apps.
    cleartext: false,
  },

  android: {
    // Target SDK 34+ as required by Google Play (2024+)
    // minSdkVersion 21 = Android 5.0 — covers 99.5% of active Android devices
    // Adaptive icon resources must be placed in:
    //   android/app/src/main/res/mipmap-*/ic_launcher.xml (foreground + background layers)
    buildOptions: {
      keystorePath: undefined, // Set via CI environment variable or local keystore file
      keystoreAlias: undefined,
    },
    // Allow mixed content during development only — remove for production
    allowMixedContent: false,
    // Disable text zoom so our carefully sized fonts don't get mangled
    textZoom: 100,
    // Back-button navigation: go back in WebView history, exit if at root
    // (default Capacitor behavior — fine for this app)
    initialFocus: true,
  },

  plugins: {
    // SplashScreen: hide after the WebView finishes loading
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#FFFDF8",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },

    // StatusBar: use light overlay on warm cream background
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#B45309",
    },

    // Keyboard: resize WebView when soft keyboard opens (important for signup form)
    Keyboard: {
      resize: "body",
      style: "LIGHT",
    },
  },
};

export default config;
