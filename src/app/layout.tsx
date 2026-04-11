import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://calmkids-academy.vercel.app';

export const metadata: Metadata = {
  title: {
    default: 'CalmKids Academy — Ad-Free Educational Screen Time for Ages 2–8',
    template: '%s | CalmKids Academy',
  },
  description:
    'CalmKids Academy is ad-free, COPPA-compliant educational screen time for ages 2–8. Phonics, mindfulness, and SEL in 15-minute daily sessions. From $4.99/mo.',
  applicationName: 'CalmKids Academy',
  keywords: [
    'kids educational app',
    'COPPA-compliant kids app',
    'ad-free kids app',
    'mindfulness for kids',
    'phonics app ages 2-8',
    'social emotional learning kids',
    'preschool learning app',
    'screen time alternative',
    'kindergarten readiness app',
    'safe kids app',
  ],
  metadataBase: new URL(APP_URL),
  alternates: { canonical: APP_URL },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CalmKids Academy',
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: '/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
      { url: '/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.svg', sizes: '180x180', type: 'image/svg+xml' }],
  },
  // Note: openGraph.images and twitter.images are INTENTIONALLY omitted
  // so Next.js auto-discovers src/app/opengraph-image.tsx and serves the
  // dynamically-generated, branded OG image at /opengraph-image.
  openGraph: {
    type: 'website',
    siteName: 'CalmKids Academy',
    title: 'CalmKids Academy — Ad-Free Educational Screen Time for Ages 2–8',
    description:
      'Ad-free, COPPA-compliant educational screen time. Phonics, mindfulness, and SEL in 15-minute daily sessions.',
    url: APP_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CalmKids Academy — Ad-Free Educational Screen Time for Ages 2–8',
    description:
      'COPPA-compliant, zero ads, zero tracking. From $4.99/mo or $199 lifetime.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#FF9F43',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${APP_URL}/#organization`,
      name: 'CalmKids Academy',
      url: APP_URL,
      logo: { '@type': 'ImageObject', url: `${APP_URL}/icon-512.svg` },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${APP_URL}/#app`,
      name: 'CalmKids Academy',
      applicationCategory: 'EducationalApplication',
      applicationSubCategory: 'Early Childhood Education',
      operatingSystem: 'Android, iOS, Web',
      url: APP_URL,
      description:
        'Ad-free, COPPA-compliant educational screen time for children ages 2–8. Phonics, mindfulness, and social-emotional learning in structured 15-minute daily sessions.',
      audience: {
        '@type': 'PeopleAudience',
        suggestedMinAge: 2,
        suggestedMaxAge: 8,
      },
      offers: [
        {
          '@type': 'Offer',
          name: 'Monthly',
          price: '4.99',
          priceCurrency: 'USD',
          description: 'All content, one child profile, parent dashboard.',
        },
        {
          '@type': 'Offer',
          name: 'Annual',
          price: '79.00',
          priceCurrency: 'USD',
          description: 'Saves ~33% vs monthly. Up to 3 child profiles.',
        },
        {
          '@type': 'Offer',
          name: 'Lifetime',
          price: '199.00',
          priceCurrency: 'USD',
          description: 'One-time payment. Up to 5 child profiles. 30-day refund.',
        },
      ],
      featureList: [
        '15-minute structured daily sessions',
        'Phonics and early literacy',
        'Early math readiness',
        'Mindfulness and breathing exercises',
        'Social-emotional learning (SEL)',
        'Parental dashboard',
        'Screen-time limits',
        'COPPA-compliant',
        'Zero advertising',
        'Zero behavioral tracking of children',
      ],
      knowsAbout: [
        'early childhood education',
        'phonics',
        'social emotional learning',
        'mindfulness for children',
        'COPPA compliance',
        'screen time management',
        'ad-free kids apps',
      ],
      publisher: { '@id': `${APP_URL}/#organization` },
    },
    {
      '@type': 'WebSite',
      '@id': `${APP_URL}/#website`,
      url: APP_URL,
      name: 'CalmKids Academy',
      publisher: { '@id': `${APP_URL}/#organization` },
    },
    {
      '@type': 'WebPage',
      '@id': `${APP_URL}/#webpage`,
      url: APP_URL,
      name: 'CalmKids Academy — Ad-Free Educational Screen Time for Ages 2–8',
      isPartOf: { '@id': `${APP_URL}/#website` },
      about: { '@id': `${APP_URL}/#app` },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What ages is CalmKids Academy for?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Children ages 2 through 8. Content is tiered by developmental stage and covers phonics, early math, mindfulness, and social-emotional learning.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is CalmKids Academy really ad-free?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. No banner ads, no video pre-rolls, no sponsored content, no affiliate links, no upsells shown to the child. Only the parent dashboard ever mentions the subscription.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is CalmKids Academy COPPA-compliant?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. CalmKids Academy collects no personally identifiable information on children, no behavioral tracking, no device fingerprinting, and no third-party analytics on child-facing screens.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long are the daily sessions?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sessions are 15 minutes by default and auto-end when the timer runs out. Parents can extend in 5-minute increments from the dashboard.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is included in the Lifetime plan?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The $199 Lifetime plan is a one-time payment that includes all current and future content, up to 5 child profiles, and a 30-day money-back guarantee.',
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CalmKids Academy" />
        <style>{`:root { --accent-color: #FF9F43; } html, body { overscroll-behavior-y: none; -webkit-tap-highlight-color: transparent; }`}</style>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function () {
                  navigator.serviceWorker.register('/sw.js').catch(function () {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
