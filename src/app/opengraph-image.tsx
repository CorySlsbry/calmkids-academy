import { ImageResponse } from 'next/og';

// Dynamic per-app OG image — replaces the static public/og-image.png
// so every CalmKids Academy link shared on social media gets its own
// branded card instead of the shared template image.
export const runtime = 'edge';
export const alt =
  'CalmKids Academy — Ad-free educational screen time for ages 2–8';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background:
            'linear-gradient(135deg, #FF9F43 0%, #E65100 55%, #4a1e00 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: 80,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -180,
            left: -180,
            width: 560,
            height: 560,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -200,
            right: -200,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          }}
        />

        <div
          style={{
            fontSize: 32,
            color: 'rgba(255,255,255,0.8)',
            letterSpacing: 6,
            textTransform: 'uppercase',
            marginBottom: 24,
            display: 'flex',
          }}
        >
          CalmKids Academy
        </div>
        <div
          style={{
            fontSize: 100,
            color: 'white',
            fontWeight: 800,
            letterSpacing: -3,
            lineHeight: 1.05,
            textAlign: 'center',
            display: 'flex',
          }}
        >
          Screen time you trust.
        </div>
        <div
          style={{
            fontSize: 40,
            color: 'rgba(255,255,255,0.92)',
            marginTop: 32,
            textAlign: 'center',
            maxWidth: 980,
            lineHeight: 1.35,
            display: 'flex',
          }}
        >
          15-minute daily sessions. Phonics, math, mindfulness, SEL. Zero ads,
          zero tracking, COPPA-compliant. Ages 2–8.
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 48,
            left: 80,
            fontSize: 24,
            color: 'rgba(255,255,255,0.8)',
            display: 'flex',
          }}
        >
          calmkids-academy.vercel.app
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            right: 80,
            fontSize: 24,
            color: 'rgba(255,255,255,0.8)',
            display: 'flex',
          }}
        >
          Ad-free. COPPA-compliant.
        </div>
      </div>
    ),
    { ...size }
  );
}
